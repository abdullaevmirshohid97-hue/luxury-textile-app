import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import OpenAI from "openai";
import { storage } from "./storage";

const SessionStore = MemoryStore(session);

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
    username: string;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mary-collection-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

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
      const product = await storage.getProductBySlug(req.params.slug);
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

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, language = "en" } = req.body;

      const aiSetting = await storage.getSettingByKey("ai_assistant_enabled");
      if (aiSetting?.value !== "true") {
        return res.status(503).json({ error: "AI assistant is disabled" });
      }

      const products = await storage.getProducts();
      const categories = await storage.getCategories();

      const productInfo = products.map((p) => ({
        name: language === "ru" ? p.nameRu : language === "uz" ? p.nameUz : p.nameEn,
        description: language === "ru" ? p.descriptionRu : language === "uz" ? p.descriptionUz : p.descriptionEn,
        material: language === "ru" ? p.materialRu : language === "uz" ? p.materialUz : p.materialEn,
        sizes: p.sizes,
        colors: p.colors,
        category: categories.find((c) => c.id === p.categoryId)?.[`name${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof typeof categories[0]],
      }));

      const systemPrompt = language === "ru"
        ? `Вы - элегантный консультант Mary Collection, премиального бренда домашнего текстиля. Помогайте клиентам с выбором халатов и полотенец. Будьте вежливы и изысканны. Вот наши продукты: ${JSON.stringify(productInfo)}. Отвечайте на русском языке.`
        : language === "uz"
        ? `Siz Mary Collection - premium uy tekstil brendining nafis maslahatchisisiz. Mijozlarga xalatlar va sochiqlar tanlashda yordam bering. Nazokat va nazokatni saqlang. Bizning mahsulotlarimiz: ${JSON.stringify(productInfo)}. O'zbek tilida javob bering.`
        : `You are an elegant assistant for Mary Collection, a premium home textile brand. Help customers choose bathrobes and towels. Be refined and gracious. Here are our products: ${JSON.stringify(productInfo)}. Respond in English.`;

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
        max_completion_tokens: 500,
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

      if (user && user.password === password) {
        req.session.isAdmin = true;
        req.session.username = username;
        res.json({ success: true });
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
    res.json({ authenticated: !!req.session?.isAdmin });
  });

  app.get("/api/admin/stats", requireAdmin, async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      const categories = await storage.getCategories();
      const inquiries = await storage.getInquiries();
      const newInquiries = inquiries.filter((i) => i.status === "new");

      res.json({
        products: products.length,
        categories: categories.length,
        inquiries: inquiries.length,
        newInquiries: newInquiries.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
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

  app.post("/api/admin/settings", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.upsertSetting(key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to save setting" });
    }
  });

  return httpServer;
}
