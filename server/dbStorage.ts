import { eq, asc } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "./db";
import {
  users, categories, products, contactMessages, inquiries, leads, siteContent, settings, analytics,
  processSteps, ctaConfigs, trustBlocks, formOptions,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type ContactMessage, type InsertContactMessage,
  type Inquiry, type InsertInquiry,
  type Lead, type InsertLead,
  type SiteContent, type InsertSiteContent,
  type Settings, type InsertSettings,
  type Analytics, type InsertAnalytics,
  type ProcessStep, type InsertProcessStep,
  type CtaConfig, type InsertCtaConfig,
  type TrustBlock, type InsertTrustBlock,
  type FormOption, type InsertFormOption,
  calculateLeadScore,
} from "@shared/schema";
import { sql, and, gte, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

const SALT_ROUNDS = 12;

export class DatabaseStorage implements IStorage {
  async trackAnalytics(data: InsertAnalytics): Promise<void> {
    await db.insert(analytics).values(data);
  }

  async getTrendingProductIds(limit: number = 6): Promise<number[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    const productClicks = await db.select({
      productId: analytics.productId,
      count: sql<number>`count(*)`,
    })
    .from(analytics)
    .where(and(
      eq(analytics.type, 'product_click'),
      gte(analytics.createdAt, startDate),
      sql`${analytics.productId} IS NOT NULL`
    ))
    .groupBy(analytics.productId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);

    return productClicks
      .filter(pc => pc.productId !== null)
      .map(pc => pc.productId as number);
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

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(msg).returning();
    return created;
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

  async getLeadsToday(): Promise<Lead[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return db.select().from(leads).where(gte(leads.createdAt, today));
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

  async updateLeadTelegramId(id: number, telegramId: string): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ telegramId }).where(eq(leads.id, id)).returning();
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

  // Process Steps
  async getProcessSteps(): Promise<ProcessStep[]> {
    return db.select().from(processSteps).where(eq(processSteps.enabled, true)).orderBy(asc(processSteps.sortOrder));
  }

  async getProcessStep(id: number): Promise<ProcessStep | undefined> {
    const [step] = await db.select().from(processSteps).where(eq(processSteps.id, id));
    return step;
  }

  async createProcessStep(step: InsertProcessStep): Promise<ProcessStep> {
    const [created] = await db.insert(processSteps).values(step).returning();
    return created;
  }

  async updateProcessStep(id: number, step: Partial<InsertProcessStep>): Promise<ProcessStep | undefined> {
    const [updated] = await db.update(processSteps).set(step).where(eq(processSteps.id, id)).returning();
    return updated;
  }

  async deleteProcessStep(id: number): Promise<void> {
    await db.delete(processSteps).where(eq(processSteps.id, id));
  }

  // CTA Configs
  async getCtaConfigs(): Promise<CtaConfig[]> {
    return db.select().from(ctaConfigs).where(eq(ctaConfigs.enabled, true));
  }

  async getCtaConfig(id: number): Promise<CtaConfig | undefined> {
    const [cta] = await db.select().from(ctaConfigs).where(eq(ctaConfigs.id, id));
    return cta;
  }

  async getCtaConfigByKey(key: string): Promise<CtaConfig | undefined> {
    const [cta] = await db.select().from(ctaConfigs).where(eq(ctaConfigs.ctaKey, key));
    return cta;
  }

  async createCtaConfig(cta: InsertCtaConfig): Promise<CtaConfig> {
    const [created] = await db.insert(ctaConfigs).values(cta).returning();
    return created;
  }

  async updateCtaConfig(id: number, cta: Partial<InsertCtaConfig>): Promise<CtaConfig | undefined> {
    const [updated] = await db.update(ctaConfigs).set(cta).where(eq(ctaConfigs.id, id)).returning();
    return updated;
  }

  async deleteCtaConfig(id: number): Promise<void> {
    await db.delete(ctaConfigs).where(eq(ctaConfigs.id, id));
  }

  // Trust Blocks
  async getTrustBlocks(): Promise<TrustBlock[]> {
    return db.select().from(trustBlocks).where(eq(trustBlocks.enabled, true)).orderBy(asc(trustBlocks.sortOrder));
  }

  async getTrustBlocksByPage(page: string): Promise<TrustBlock[]> {
    return db.select().from(trustBlocks).where(and(eq(trustBlocks.page, page), eq(trustBlocks.enabled, true))).orderBy(asc(trustBlocks.sortOrder));
  }

  async getTrustBlock(id: number): Promise<TrustBlock | undefined> {
    const [block] = await db.select().from(trustBlocks).where(eq(trustBlocks.id, id));
    return block;
  }

  async createTrustBlock(block: InsertTrustBlock): Promise<TrustBlock> {
    const [created] = await db.insert(trustBlocks).values(block).returning();
    return created;
  }

  async updateTrustBlock(id: number, block: Partial<InsertTrustBlock>): Promise<TrustBlock | undefined> {
    const [updated] = await db.update(trustBlocks).set(block).where(eq(trustBlocks.id, id)).returning();
    return updated;
  }

  async deleteTrustBlock(id: number): Promise<void> {
    await db.delete(trustBlocks).where(eq(trustBlocks.id, id));
  }

  // Form Options
  async getFormOptions(): Promise<FormOption[]> {
    return db.select().from(formOptions).where(eq(formOptions.enabled, true)).orderBy(asc(formOptions.sortOrder));
  }

  async getFormOptionsByField(field: string): Promise<FormOption[]> {
    return db.select().from(formOptions).where(and(eq(formOptions.formField, field), eq(formOptions.enabled, true))).orderBy(asc(formOptions.sortOrder));
  }

  async getFormOption(id: number): Promise<FormOption | undefined> {
    const [option] = await db.select().from(formOptions).where(eq(formOptions.id, id));
    return option;
  }

  async createFormOption(option: InsertFormOption): Promise<FormOption> {
    const [created] = await db.insert(formOptions).values(option).returning();
    return created;
  }

  async updateFormOption(id: number, option: Partial<InsertFormOption>): Promise<FormOption | undefined> {
    const [updated] = await db.update(formOptions).set(option).where(eq(formOptions.id, id)).returning();
    return updated;
  }

  async deleteFormOption(id: number): Promise<void> {
    await db.delete(formOptions).where(eq(formOptions.id, id));
  }
}

export async function initializeDatabase(storage: DatabaseStorage): Promise<void> {
  const existingUsers = await storage.getUsers();
  if (existingUsers.length === 0) {
    console.log("[db] Creating initial admin account...");
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD environment variable is not set. Cannot create initial admin account.");
    }
    await storage.createUser({
      username: "marycollection.uzb",
      password: adminPassword,
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

  // Seed process steps for B2B manufacturing process page
  const existingSteps = await storage.getProcessSteps();
  if (existingSteps.length === 0) {
    console.log("[db] Seeding process steps...");
    const defaultSteps: InsertProcessStep[] = [
      { stepKey: "inquiry", sortOrder: 1, icon: "FileText", titleEn: "Initial Inquiry", titleRu: "Первичный запрос", titleUz: "Dastlabki so'rov", descriptionEn: "Submit your requirements through our inquiry form. Include product specifications, estimated volumes, and delivery timeline.", descriptionRu: "Отправьте ваши требования через форму запроса. Укажите спецификации продукции, предполагаемые объемы и сроки поставки.", descriptionUz: "So'rov formasi orqali talablaringizni yuboring. Mahsulot spetsifikatsiyalari, taxminiy hajmlar va yetkazib berish muddatlarini ko'rsating.", enabled: true },
      { stepKey: "specification", sortOrder: 2, icon: "ClipboardList", titleEn: "Specification Review", titleRu: "Анализ спецификаций", titleUz: "Spetsifikatsiya tahlili", descriptionEn: "Our technical team reviews your specifications and provides a detailed quotation within 24-48 hours.", descriptionRu: "Наша техническая команда рассматривает ваши спецификации и предоставляет детальное коммерческое предложение в течение 24-48 часов.", descriptionUz: "Texnik jamoamiz sizning spetsifikatsiyalaringizni ko'rib chiqadi va 24-48 soat ichida batafsil taklif beradi.", enabled: true },
      { stepKey: "sampling", sortOrder: 3, icon: "Package", titleEn: "Sampling & Approval", titleRu: "Образцы и утверждение", titleUz: "Namunalar va tasdiqlash", descriptionEn: "We produce samples for your approval before full production. Sampling cost applied to first order.", descriptionRu: "Мы производим образцы для вашего одобрения перед полным производством. Стоимость образцов включается в первый заказ.", descriptionUz: "To'liq ishlab chiqarishdan oldin sizning tasdig'ingiz uchun namunalar ishlab chiqaramiz. Namuna narxi birinchi buyurtmaga qo'shiladi.", enabled: true },
      { stepKey: "pilot", sortOrder: 4, icon: "Settings", titleEn: "Pilot Production", titleRu: "Пилотное производство", titleUz: "Pilot ishlab chiqarish", descriptionEn: "Small batch production to validate quality standards and production processes.", descriptionRu: "Производство небольшой партии для проверки стандартов качества и производственных процессов.", descriptionUz: "Sifat standartlari va ishlab chiqarish jarayonlarini tekshirish uchun kichik partiya ishlab chiqarish.", enabled: true },
      { stepKey: "production", sortOrder: 5, icon: "Factory", titleEn: "Full-Scale Manufacturing", titleRu: "Полномасштабное производство", titleUz: "To'liq ko'lamli ishlab chiqarish", descriptionEn: "Vertically integrated production from raw cotton to finished product. All manufacturing in Uzbekistan.", descriptionRu: "Вертикально интегрированное производство от сырого хлопка до готового продукта. Все производство в Узбекистане.", descriptionUz: "Xom paxtadan tayyor mahsulotgacha vertikal integratsiyalashgan ishlab chiqarish. Barcha ishlab chiqarish O'zbekistonda.", enabled: true },
      { stepKey: "delivery", sortOrder: 6, icon: "Truck", titleEn: "Quality Control & Delivery", titleRu: "Контроль качества и доставка", titleUz: "Sifat nazorati va yetkazib berish", descriptionEn: "Final QC inspection and international shipping. FOB/CIF terms available.", descriptionRu: "Финальная инспекция контроля качества и международная доставка. Доступны условия FOB/CIF.", descriptionUz: "Yakuniy sifat nazorati tekshiruvi va xalqaro yetkazib berish. FOB/CIF shartlari mavjud.", enabled: true },
    ];
    for (const step of defaultSteps) {
      await storage.createProcessStep(step);
    }
    console.log("[db] Process steps seeded");
  }

  // Seed CTA configurations
  const existingCtas = await storage.getCtaConfigs();
  if (existingCtas.length === 0) {
    console.log("[db] Seeding CTA configs...");
    const defaultCtas: InsertCtaConfig[] = [
      { ctaKey: "home_hero", labelEn: "Request a Quote", labelRu: "Запросить расчет", labelUz: "Narx so'rash", helperTextEn: "Get a personalized quote within 24-48 hours", helperTextRu: "Получите индивидуальный расчет в течение 24-48 часов", helperTextUz: "24-48 soat ichida shaxsiy narx oling", targetUrl: "/contact", enabled: true },
      { ctaKey: "home_secondary", labelEn: "View Our Process", labelRu: "Наш процесс", labelUz: "Jarayonimiz", helperTextEn: "See our 6-step B2B manufacturing process", helperTextRu: "Ознакомьтесь с нашим 6-этапным производственным процессом", helperTextUz: "Bizning 6 bosqichli B2B ishlab chiqarish jarayonimizni ko'ring", targetUrl: "/process", enabled: true },
      { ctaKey: "business_inquiry", labelEn: "Submit Business Inquiry", labelRu: "Отправить бизнес-запрос", labelUz: "Biznes so'rov yuborish", helperTextEn: "Response within 24-48 hours", helperTextRu: "Ответ в течение 24-48 часов", helperTextUz: "24-48 soat ichida javob", targetUrl: "/contact", enabled: true },
      { ctaKey: "process_cta", labelEn: "Start Your Inquiry", labelRu: "Начать запрос", labelUz: "So'rovni boshlash", helperTextEn: "Sampling available before commitment", helperTextRu: "Образцы доступны до обязательств", helperTextUz: "Majburiyatdan oldin namunalar mavjud", targetUrl: "/contact", enabled: true },
    ];
    for (const cta of defaultCtas) {
      await storage.createCtaConfig(cta);
    }
    console.log("[db] CTA configs seeded");
  }

  // Seed trust blocks
  const existingBlocks = await storage.getTrustBlocks();
  if (existingBlocks.length === 0) {
    console.log("[db] Seeding trust blocks...");
    const defaultBlocks: InsertTrustBlock[] = [
      { blockKey: "iso_certified", page: "home", sortOrder: 1, icon: "Shield", titleEn: "ISO 9001 Certified", titleRu: "Сертификат ISO 9001", titleUz: "ISO 9001 sertifikati", descriptionEn: "Quality management system certified", descriptionRu: "Сертифицированная система менеджмента качества", descriptionUz: "Sertifikatlangan sifat boshqaruv tizimi", enabled: true },
      { blockKey: "vertical_integration", page: "home", sortOrder: 2, icon: "Layers", titleEn: "Vertically Integrated", titleRu: "Вертикальная интеграция", titleUz: "Vertikal integratsiya", descriptionEn: "From raw cotton to finished product", descriptionRu: "От сырого хлопка до готовой продукции", descriptionUz: "Xom paxtadan tayyor mahsulotgacha", enabled: true },
      { blockKey: "moq", page: "business", sortOrder: 1, icon: "Package", titleEn: "MOQ 500 Units", titleRu: "МОЗ 500 единиц", titleUz: "MOQ 500 dona", descriptionEn: "Minimum order quantity for B2B partners", descriptionRu: "Минимальный объем заказа для B2B партнеров", descriptionUz: "B2B hamkorlar uchun minimal buyurtma hajmi", enabled: true },
      { blockKey: "lead_time", page: "business", sortOrder: 2, icon: "Clock", titleEn: "4-6 Week Lead Time", titleRu: "Срок 4-6 недель", titleUz: "4-6 hafta muddat", descriptionEn: "Standard production timeline", descriptionRu: "Стандартные сроки производства", descriptionUz: "Standart ishlab chiqarish muddati", enabled: true },
    ];
    for (const block of defaultBlocks) {
      await storage.createTrustBlock(block);
    }
    console.log("[db] Trust blocks seeded");
  }

  // Seed form options
  const existingOptions = await storage.getFormOptions();
  if (existingOptions.length === 0) {
    console.log("[db] Seeding form options...");
    const defaultOptions: InsertFormOption[] = [
      { formField: "sector", optionValue: "hospitality", sortOrder: 1, labelEn: "Hospitality (Hotels & Spas)", labelRu: "Гостеприимство (Отели и СПА)", labelUz: "Mehmondo'stlik (Mehmonxonalar va SPA)", enabled: true },
      { formField: "sector", optionValue: "retail", sortOrder: 2, labelEn: "Retail / Private Label", labelRu: "Розница / Частная марка", labelUz: "Chakana savdo / Xususiy brend", enabled: true },
      { formField: "sector", optionValue: "contract", sortOrder: 3, labelEn: "Contract Manufacturing (OEM/ODM)", labelRu: "Контрактное производство (OEM/ODM)", labelUz: "Shartnoma ishlab chiqarish (OEM/ODM)", enabled: true },
      { formField: "volume", optionValue: "500-1000", sortOrder: 1, labelEn: "500 - 1,000 units", labelRu: "500 - 1 000 единиц", labelUz: "500 - 1,000 dona", enabled: true },
      { formField: "volume", optionValue: "1000-5000", sortOrder: 2, labelEn: "1,000 - 5,000 units", labelRu: "1 000 - 5 000 единиц", labelUz: "1,000 - 5,000 dona", enabled: true },
      { formField: "volume", optionValue: "5000+", sortOrder: 3, labelEn: "5,000+ units", labelRu: "5 000+ единиц", labelUz: "5,000+ dona", enabled: true },
    ];
    for (const option of defaultOptions) {
      await storage.createFormOption(option);
    }
    console.log("[db] Form options seeded");
  }
}

export const dbStorage = new DatabaseStorage();
