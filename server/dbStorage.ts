import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "./db";
import {
  users, categories, products, inquiries, leads, siteContent, settings, analytics,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Inquiry, type InsertInquiry,
  type Lead, type InsertLead,
  type SiteContent, type InsertSiteContent,
  type Settings, type InsertSettings,
  type Analytics, type InsertAnalytics,
  calculateLeadScore,
} from "@shared/schema";
import { sql, and, gte, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

const SALT_ROUNDS = 12;

export class DatabaseStorage implements IStorage {
  async trackAnalytics(data: InsertAnalytics): Promise<void> {
    await db.insert(analytics).values(data);
  }

  async getAnalyticsStats(timeframe: 'day' | 'week' | 'month' = 'day') {
    const now = new Date();
    let startDate = new Date();
    if (timeframe === 'day') startDate.setDate(now.getDate() - 1);
    else if (timeframe === 'week') startDate.setDate(now.getDate() - 7);
    else if (timeframe === 'month') startDate.setMonth(now.getMonth() - 1);

    const stats = await db.select({
      count: sql<number>`count(*)`,
      type: analytics.type,
    })
    .from(analytics)
    .where(gte(analytics.createdAt, startDate))
    .groupBy(analytics.type);

    const pageViews = await db.select({
      count: sql<number>`count(*)`,
      page: analytics.page,
    })
    .from(analytics)
    .where(and(eq(analytics.type, 'page_view'), gte(analytics.createdAt, startDate)))
    .groupBy(analytics.page)
    .orderBy(desc(sql`count(*)`));

    const productClicks = await db.select({
      count: sql<number>`count(*)`,
      productId: analytics.productId,
    })
    .from(analytics)
    .where(and(eq(analytics.type, 'product_click'), gte(analytics.createdAt, startDate)))
    .groupBy(analytics.productId)
    .orderBy(desc(sql`count(*)`));

    return {
      overview: stats,
      pages: pageViews,
      products: productClicks,
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);
    const [created] = await db.insert(users).values({
      ...user,
      password: passwordHash,
      role: "admin",
    }).returning();
    return created;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [updated] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return updated;
  }

  async updateUserPassword(id: string, password: string): Promise<User | undefined> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [updated] = await db.update(users).set({ password: passwordHash }).where(eq(users.id, id)).returning();
    return updated;
  }

  async updateUserCredentials(id: string, username: string, password: string): Promise<User | undefined> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [updated] = await db.update(users).set({ username, password: passwordHash }).where(eq(users.id, id)).returning();
    return updated;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getInquiries(): Promise<Inquiry[]> {
    return db.select().from(inquiries);
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [created] = await db.insert(inquiries).values(inquiry).returning();
    return created;
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const [updated] = await db.update(inquiries).set({ status }).where(eq(inquiries.id, id)).returning();
    return updated;
  }

  async deleteInquiry(id: number): Promise<void> {
    await db.delete(inquiries).where(eq(inquiries.id, id));
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const score = calculateLeadScore({
      leadType: leadData.leadType || "b2c",
      language: leadData.language || "en",
      country: leadData.country,
      source: leadData.source,
      message: leadData.message,
    });
    const [created] = await db.insert(leads).values({ ...leadData, score }).returning();
    return created;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set(lead).where(eq(leads.id, id)).returning();
    return updated;
  }

  async updateLeadStatus(id: number, status: string): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ status }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getSiteContent(): Promise<SiteContent[]> {
    return db.select().from(siteContent);
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }

  async upsertSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const existing = await this.getSiteContentByKey(content.key);
    if (existing) {
      const [updated] = await db.update(siteContent).set(content).where(eq(siteContent.key, content.key)).returning();
      return updated;
    }
    const [created] = await db.insert(siteContent).values(content).returning();
    return created;
  }

  async getSettings(): Promise<Settings[]> {
    return db.select().from(settings);
  }

  async getSettingByKey(key: string): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }

  async upsertSetting(key: string, value: string): Promise<Settings> {
    const existing = await this.getSettingByKey(key);
    if (existing) {
      const [updated] = await db.update(settings).set({ value }).where(eq(settings.key, key)).returning();
      return updated;
    }
    const [created] = await db.insert(settings).values({ key, value }).returning();
    return created;
  }
}

export async function initializeDatabase(storage: DatabaseStorage): Promise<void> {
  const existingUsers = await storage.getUsers();
  if (existingUsers.length === 0) {
    console.log("[db] Creating initial admin account...");
    await storage.createUser({
      username: "marycollection.uzb",
      password: "Aa1234567890@0987654321@",
    });
    console.log("[db] Initial admin account created");
  }

  const existingCategories = await storage.getCategories();
  if (existingCategories.length === 0) {
    console.log("[db] Seeding default categories...");
    const defaultCategories: InsertCategory[] = [
      { slug: "bathrobes", nameEn: "Bathrobes", nameRu: "Халаты", nameUz: "Xalatlar", descriptionEn: "Luxury cotton bathrobes for home and hospitality", descriptionRu: "Роскошные хлопковые халаты для дома и гостиничного бизнеса", descriptionUz: "Uy va mehmonxonalar uchun hashamatli paxta xalatlar", categoryType: "b2c" },
      { slug: "towels", nameEn: "Towels", nameRu: "Полотенца", nameUz: "Sochiqlar", descriptionEn: "Premium bath towels crafted with finest cotton", descriptionRu: "Премиальные банные полотенца из лучшего хлопка", descriptionUz: "Eng yaxshi paxtadan tayyorlangan premium hammom sochiqlari", categoryType: "b2c" },
      { slug: "pastel", nameEn: "Pastel Collection", nameRu: "Пастельная коллекция", nameUz: "Pastel kolleksiyasi", descriptionEn: "Elegant gift boxes and pastel-toned textile sets", descriptionRu: "Элегантные подарочные наборы и текстиль в пастельных тонах", descriptionUz: "Nafis sovg'a qutilari va pastel rangdagi tekstil to'plamlari", categoryType: "b2c" },
      { slug: "spa-hotel", nameEn: "Spa & Hotel", nameRu: "Спа и Отели", nameUz: "Spa va Mehmonxonalar", descriptionEn: "Professional-grade textiles for hospitality industry", descriptionRu: "Профессиональный текстиль для индустрии гостеприимства", descriptionUz: "Mehmondo'stlik sohasi uchun professional tekstil", categoryType: "b2b" },
      { slug: "barber", nameEn: "Barber Shop", nameRu: "Барбершоп", nameUz: "Sartaroshxona", descriptionEn: "Premium towels and capes for professional barber shops", descriptionRu: "Премиальные полотенца и накидки для профессиональных барбершопов", descriptionUz: "Professional sartaroshxonalar uchun premium sochiqlar va pelerinlar", categoryType: "b2b" },
      { slug: "accessories", nameEn: "Accessories", nameRu: "Аксессуары", nameUz: "Aksessuarlar", descriptionEn: "Slippers, towel sets, gift boxes, and storage bags", descriptionRu: "Тапочки, наборы полотенец, подарочные коробки и сумки для хранения", descriptionUz: "Shippak, sochiq to'plamlari, sovg'a qutilari va saqlash sumkalari", categoryType: "b2c" },
    ];
    for (const cat of defaultCategories) {
      await storage.createCategory(cat);
    }
    console.log("[db] Default categories seeded");
  }

  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const cats = await storage.getCategories();
    const catMap: Record<string, number> = {};
    for (const c of cats) {
      catMap[c.slug] = c.id;
    }

    console.log("[db] Seeding default products...");
    const defaultProducts: InsertProduct[] = [
      { categoryId: catMap["bathrobes"], slug: "classic-bathrobe", nameEn: "Classic Cotton Bathrobe", nameRu: "Классический хлопковый халат", nameUz: "Klassik paxta xalat", descriptionEn: "Luxurious cotton bathrobe in cream color", descriptionRu: "Роскошный хлопковый халат кремового цвета", descriptionUz: "Krem rangidagi hashamatli paxta xalat", materialEn: "100% Premium Egyptian Cotton", materialRu: "100% Премиальный египетский хлопок", materialUz: "100% Premium Misr paxtasi", careEn: "Machine wash cold, tumble dry low", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL", colors: "Cream,Beige,White", images: "bathrobe-1", featured: true },
      { categoryId: catMap["bathrobes"], slug: "spa-bathrobe", nameEn: "Spa Luxury Bathrobe", nameRu: "Спа-халат люкс", nameUz: "Spa hashamat xalati", descriptionEn: "Premium spa bathrobe in soft pastel tones", descriptionRu: "Премиальный спа-халат в мягких пастельных тонах", descriptionUz: "Yumshoq pastel ranglardagi premium spa xalati", materialEn: "100% Organic Cotton", materialRu: "100% Органический хлопок", materialUz: "100% Organik paxta", careEn: "Machine wash cold", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL,XXL", colors: "Light Pink,Mint,Lavender", images: "bathrobe-2", featured: true },
      { categoryId: catMap["towels"], slug: "bath-towel-set", nameEn: "Premium Bath Towel Set", nameRu: "Премиум набор банных полотенец", nameUz: "Premium hammom sochiq to'plami", descriptionEn: "Set of luxurious bath towels", descriptionRu: "Набор роскошных банных полотенец", descriptionUz: "Hashamatli hammom sochiqlari to'plami", materialEn: "100% Long-Staple Cotton", materialRu: "100% Длинноволокнистый хлопок", materialUz: "100% Uzun tolali paxta", careEn: "Machine wash warm", careRu: "Машинная стирка в теплой воде", careUz: "Iliq suvda yuvish", sizes: "Standard,Large", colors: "White,Cream,Sand", images: "towel-1", featured: true },
      { categoryId: catMap["pastel"], slug: "pastel-gift-box", nameEn: "Pastel Gift Box", nameRu: "Подарочный набор Пастель", nameUz: "Pastel sovg'a qutisi", descriptionEn: "Elegant gift box with towels and robe in pastel colors", descriptionRu: "Элегантный подарочный набор с полотенцами и халатом в пастельных тонах", descriptionUz: "Pastel rangdagi sochiq va xalat bilan nafis sovg'a qutisi", materialEn: "100% Premium Cotton", materialRu: "100% Премиальный хлопок", materialUz: "100% Premium paxta", careEn: "Machine wash cold", careRu: "Машинная стирка", careUz: "Sovuq suvda yuvish", sizes: "One Size", colors: "Blush Pink,Sage Green,Lavender", images: "pastel-1", featured: true },
      { categoryId: catMap["spa-hotel"], slug: "hotel-bathrobe-white", nameEn: "Hotel Collection Bathrobe", nameRu: "Гостиничный халат", nameUz: "Mehmonxona xalati", descriptionEn: "Professional-grade bathrobe for hotels and spas", descriptionRu: "Профессиональный халат для отелей и спа", descriptionUz: "Mehmonxona va spa uchun professional xalat", materialEn: "Heavy-duty Cotton Terry", materialRu: "Плотная хлопковая махра", materialUz: "Og'ir vazifali paxta maxsa", careEn: "Industrial wash safe", careRu: "Подходит для промышленной стирки", careUz: "Sanoat yuvishga mos", sizes: "S,M,L,XL,XXL", colors: "White,Ivory", images: "hotel-1", featured: true },
      { categoryId: catMap["barber"], slug: "barber-towel-set", nameEn: "Barber Professional Towel Set", nameRu: "Профессиональный набор полотенец для барбера", nameUz: "Professional sartarosh sochiq to'plami", descriptionEn: "Premium towels designed for professional barber use", descriptionRu: "Премиальные полотенца для профессионального использования в барбершопов", descriptionUz: "Professional sartarosh foydalanishi uchun premium sochiqlar", materialEn: "Quick-dry Cotton Blend", materialRu: "Быстросохнущая хлопковая смесь", materialUz: "Tez quriydigan paxta aralashmasi", careEn: "Machine wash hot, tumble dry", careRu: "Машинная стирка в горячей воде", careUz: "Issiq suvda yuvish", sizes: "Standard", colors: "Black,White,Gray", images: "barber-1", featured: true },
      { categoryId: catMap["accessories"], slug: "luxury-slippers", nameEn: "Luxury Spa Slippers", nameRu: "Люксовые спа-тапочки", nameUz: "Hashamatli spa shippaklar", descriptionEn: "Comfortable slippers for home and spa use", descriptionRu: "Комфортные тапочки для дома и спа", descriptionUz: "Uy va spa uchun qulay shippaklar", materialEn: "Cotton Terry Upper, Non-slip Sole", materialRu: "Махровый верх, нескользящая подошва", materialUz: "Maxsali yuza, sirg'anmaydigan taglik", careEn: "Hand wash", careRu: "Ручная стирка", careUz: "Qo'lda yuvish", sizes: "S/M,L/XL", colors: "White,Cream,Gray", images: "slippers-1", featured: false },
    ];
    for (const prod of defaultProducts) {
      await storage.createProduct(prod);
    }
    console.log("[db] Default products seeded");
  }

  const aiSetting = await storage.getSettingByKey("ai_assistant_enabled");
  if (!aiSetting) {
    await storage.upsertSetting("ai_assistant_enabled", "true");
  }
}

export const dbStorage = new DatabaseStorage();
