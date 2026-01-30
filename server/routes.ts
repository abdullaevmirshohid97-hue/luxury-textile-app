import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import pgSession from "connect-pg-simple";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import OpenAI from "openai";
import { dbStorage, initializeDatabase } from "./dbStorage";
import { pool } from "./db";
import { GLOBAL_CONTACT, BRAND } from "@shared/globalConfig";
import { LeadType, LeadSource, getLeadTemperature } from "@shared/schema";

const storage = dbStorage;
const PgStore = pgSession(session);

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});


const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
    username: string;
    userRole: string;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

function requireAdminRole(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin && req.session?.userRole === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin role required" });
  }
}

function parseId(param: string | string[]): number {
  const value = Array.isArray(param) ? param[0] : param;
  return parseInt(value, 10);
}

function parseSlug(param: string | string[]): string {
  return Array.isArray(param) ? param[0] : param;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await initializeDatabase(storage);

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  }, express.static(uploadsDir));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mary-collection-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new PgStore({
        pool,
        tableName: "session",
        createTableIfMissing: true,
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.get("/api/config/contact", async (req: Request, res: Response) => {
    res.json(GLOBAL_CONTACT);
  });

  app.get("/api/config/brand", async (req: Request, res: Response) => {
    res.json(BRAND);
  });

  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(parseSlug(req.params.slug));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/inquiries", async (req: Request, res: Response) => {
    try {
      const { name, email, phone, message, productId } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      const inquiry = await storage.createInquiry({
        name,
        email,
        phone: phone || null,
        message,
        productId: productId || null,
      });
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      const { phone, email, name, source, page, leadType, language, businessType, productType, estimatedQuantity, message, country } = req.body;
      if (!phone || !source) {
        return res.status(400).json({ error: "Phone and source are required" });
      }
      const lead = await storage.createLead({
        phone,
        email: email || null,
        name: name || null,
        source,
        page: page || null,
        leadType: leadType || "b2c",
        language: language || "en",
        businessType: businessType || null,
        productType: productType || null,
        estimatedQuantity: estimatedQuantity || null,
        message: message || null,
        country: country || null,
      });

      if (process.env.BITRIX24_WEBHOOK_URL) {
        try {
          await sendLeadToCRM(lead);
        } catch (crmError) {
          console.error("CRM sync failed:", crmError);
        }
      }

      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.post("/api/bulk-order", async (req: Request, res: Response) => {
    try {
      const { phone, businessType, productType, estimatedQuantity, message, language } = req.body;
      if (!phone || !businessType || !productType) {
        return res.status(400).json({ error: "Phone, business type, and product type are required" });
      }
      const lead = await storage.createLead({
        phone,
        source: LeadSource.BULK_ORDER,
        page: "bulk-order",
        leadType: LeadType.BULK_B2B,
        language: language || "en",
        businessType,
        productType,
        estimatedQuantity: estimatedQuantity || null,
        message: message || null,
      });

      if (process.env.BITRIX24_WEBHOOK_URL) {
        try {
          await sendLeadToCRM(lead);
        } catch (crmError) {
          console.error("CRM sync failed:", crmError);
        }
      }

      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bulk order lead" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, language = "en" } = req.body;

      const aiSetting = await storage.getSettingByKey("ai_assistant_enabled");
      if (aiSetting?.value !== "true") {
        return res.status(503).json({ error: "AI assistant is disabled" });
      }

      const products = await storage.getProducts();
      const categories = await storage.getCategories();

      const productInfo = products.slice(0, 10).map((p) => ({
        name: language === "ru" ? p.nameRu : language === "uz" ? p.nameUz : p.nameEn,
        category: categories.find((c) => c.id === p.categoryId)?.[`name${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof typeof categories[0]],
      }));

      const categoryList = categories.map((c) => 
        language === "ru" ? c.nameRu : language === "uz" ? c.nameUz : c.nameEn
      ).join(", ");

      const contactInfo = `Phone/WhatsApp/Telegram: ${GLOBAL_CONTACT.phone}, Email: ${GLOBAL_CONTACT.email}`;
      const addressInfo = language === "ru" ? GLOBAL_CONTACT.address.ru : language === "uz" ? GLOBAL_CONTACT.address.uz : GLOBAL_CONTACT.address.en;

      const systemPrompt = language === "ru" 
        ? `Вы - профессиональный менеджер по продажам Mary Collection, премиального бренда домашнего текстиля из Узбекистана.

СТРОГИЕ ПРАВИЛА:
1. НИКОГДА не называйте цены, скидки или сроки доставки - всегда направляйте к менеджеру для получения индивидуального предложения
2. Отвечайте КОРОТКО и ТОЧНО (максимум 2-3 предложения)
3. При вопросах о ценах говорите: "Для получения индивидуального предложения свяжитесь с нами: ${contactInfo}"
4. ВСЕГДА давайте контактную информацию когда просят: ${contactInfo}
5. Адрес: ${addressInfo}

КАТЕГОРИИ: ${categoryList}

НАПРАВЛЕНИЯ:
- Спа/Отели → раздел "Spa & Hotel" (B2B)
- Барбершопы → раздел "Barber Shop" (B2B)
- Подарки → раздел "Pastel Collection"
- Оптовые заказы → страница "Bulk Order"

Будьте вежливы и профессиональны. Отвечайте на русском.`
        : language === "uz" 
        ? `Siz Mary Collection - O'zbekistondan premium uy tekstil brendining professional savdo menejersiz.

QATIY QOIDALAR:
1. HECH QACHON narx, chegirma yoki yetkazib berish muddatlarini aytmang - har doim individual taklif olish uchun menejerga yo'naltiring
2. QISQA va ANIQ javob bering (maksimum 2-3 gap)
3. Narx haqida savollarda ayting: "Individual taklif olish uchun biz bilan bog'laning: ${contactInfo}"
4. Kontakt ma'lumotlarini so'rashganda DOIM bering: ${contactInfo}
5. Manzil: ${addressInfo}

KATEGORIYALAR: ${categoryList}

YO'NALISHLAR:
- Spa/Mehmonxonalar → "Spa & Hotel" bo'limi (B2B)
- Sartaroshxonalar → "Barber Shop" bo'limi (B2B)
- Sovg'alar → "Pastel Collection" bo'limi
- Ulgurji buyurtmalar → "Bulk Order" sahifasi

Xushmuomala va professional bo'ling. O'zbek tilida javob bering.`
        : `You are a professional sales manager for Mary Collection, a premium home textile brand from Uzbekistan.

STRICT RULES:
1. NEVER give prices, discounts, or delivery timelines - always direct to manager for custom quote
2. Answer SHORT and ACCURATE (maximum 2-3 sentences)
3. For price questions say: "For a custom quote, please contact us: ${contactInfo}"
4. ALWAYS provide contact info when asked: ${contactInfo}
5. Address: ${addressInfo}

CATEGORIES: ${categoryList}

ROUTING:
- Spa/Hotels → "Spa & Hotel" section (B2B)
- Barber shops → "Barber Shop" section (B2B)
- Gifts → "Pastel Collection" section
- Bulk orders → "Bulk Order" page

Be polite and professional. Respond in English.`;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        stream: true,
        max_completion_tokens: 300,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Chat error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to process chat message" });
      } else {
        res.write(`data: ${JSON.stringify({ error: "Chat error occurred" })}\n\n`);
        res.end();
      }
    }
  });

  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (user && await storage.verifyPassword(user, password)) {
        req.session.isAdmin = true;
        req.session.username = username;
        req.session.userRole = user.role;
        res.json({ success: true, role: user.role });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Logout failed" });
      } else {
        res.json({ success: true });
      }
    });
  });

  app.get("/api/admin/session", (req: Request, res: Response) => {
    res.json({ 
      authenticated: !!req.session?.isAdmin,
      role: req.session?.userRole || null,
    });
  });

  app.get("/api/admin/stats", requireAdmin, async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      const categories = await storage.getCategories();
      const inquiries = await storage.getInquiries();
      const leads = await storage.getLeads();
      const newInquiries = inquiries.filter((i) => i.status === "new");
      const hotLeads = leads.filter((l) => getLeadTemperature(l.score) === "HOT");
      const warmLeads = leads.filter((l) => getLeadTemperature(l.score) === "WARM");

      res.json({
        products: products.length,
        categories: categories.length,
        inquiries: inquiries.length,
        newInquiries: newInquiries.length,
        totalLeads: leads.length,
        hotLeads: hotLeads.length,
        warmLeads: warmLeads.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/leads", requireAdmin, async (req: Request, res: Response) => {
    try {
      const leads = await storage.getLeads();
      const leadsWithTemp = leads.map(lead => ({
        ...lead,
        temperature: getLeadTemperature(lead.score),
      }));
      res.json(leadsWithTemp);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({
        ...lead,
        temperature: getLeadTemperature(lead.score),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.patch("/api/admin/leads/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      const { status } = req.body;
      const lead = await storage.updateLeadStatus(id, status);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({
        ...lead,
        temperature: getLeadTemperature(lead.score),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.delete("/api/admin/leads/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteLead(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  app.post("/api/admin/products", requireAdmin, async (req: Request, res: Response) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.post("/api/admin/upload", requireAdmin, upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/admin/credentials", requireAdminRole, async (req: Request, res: Response) => {
    try {
      const { newUsername, newPassword, currentPassword } = req.body;
      const user = await storage.getUserByUsername(req.session.username!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isValidPassword = await storage.verifyPassword(user, currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      await storage.updateUserCredentials(user.id, newUsername, newPassword);
      req.session.username = newUsername;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update credentials" });
    }
  });

  app.post("/api/admin/categories", requireAdmin, async (req: Request, res: Response) => {
    try {
      const category = await storage.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/admin/inquiries", requireAdmin, async (req: Request, res: Response) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.patch("/api/admin/inquiries/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      const { status } = req.body;
      const inquiry = await storage.updateInquiryStatus(id, status);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  app.delete("/api/admin/inquiries/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteInquiry(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  app.get("/api/admin/settings", requireAdmin, async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", requireAdminRole, async (req: Request, res: Response) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.upsertSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to save setting" });
    }
  });

  app.get("/api/admin/users", requireAdminRole, async (req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      const safeUsers = users.map(u => ({ id: u.id, username: u.username, role: u.role }));
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  return httpServer;
}

async function sendLeadToCRM(lead: any): Promise<void> {
  const webhookUrl = process.env.BITRIX24_WEBHOOK_URL;
  if (!webhookUrl) return;

  const temperature = getLeadTemperature(lead.score);
  
  const crmData = {
    fields: {
      TITLE: `${lead.leadType.toUpperCase()} Lead - ${lead.phone}`,
      NAME: lead.name || "New Lead",
      PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
      EMAIL: lead.email ? [{ VALUE: lead.email, VALUE_TYPE: "WORK" }] : undefined,
      SOURCE_ID: "WEB",
      COMMENTS: `Source: ${lead.source}\nPage: ${lead.page || "N/A"}\nLanguage: ${lead.language}\nScore: ${lead.score} (${temperature})\nBusiness Type: ${lead.businessType || "N/A"}\nProduct Type: ${lead.productType || "N/A"}\nQuantity: ${lead.estimatedQuantity || "N/A"}\nMessage: ${lead.message || "N/A"}`,
    },
  };

  try {
    await fetch(`${webhookUrl}/crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmData),
    });
  } catch (error) {
    console.error("Failed to send lead to CRM:", error);
  }
}
