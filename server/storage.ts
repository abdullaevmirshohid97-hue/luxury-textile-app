import type {
  User, InsertUser,
  Category, InsertCategory,
  Product, InsertProduct,
  Inquiry, InsertInquiry,
  SiteContent, InsertSiteContent,
  Settings, InsertSettings,
  Lead, InsertLead,
} from "@shared/schema";
import { calculateLeadScore } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  updateUserPassword(id: string, password: string): Promise<User | undefined>;
  updateUserCredentials(id: string, username: string, password: string): Promise<User | undefined>;
  verifyPassword(user: User, password: string): Promise<boolean>;

  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined>;
  deleteInquiry(id: number): Promise<void>;

  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  updateLeadStatus(id: number, status: string): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<void>;

  getSiteContent(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  upsertSiteContent(content: InsertSiteContent): Promise<SiteContent>;

  getSettings(): Promise<Settings[]>;
  getSettingByKey(key: string): Promise<Settings | undefined>;
  upsertSetting(key: string, value: string): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private inquiries: Map<number, Inquiry>;
  private leads: Map<number, Lead>;
  private siteContent: Map<string, SiteContent>;
  private settings: Map<string, Settings>;
  private nextCategoryId = 1;
  private nextProductId = 1;
  private nextInquiryId = 1;
  private nextLeadId = 1;
  private nextContentId = 1;
  private nextSettingId = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.inquiries = new Map();
    this.leads = new Map();
    this.siteContent = new Map();
    this.settings = new Map();

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "marycollection2024",
      role: "admin",
    };
    const managerUser: User = {
      id: randomUUID(),
      username: "manager",
      password: "manager2024",
      role: "manager",
    };
    this.users.set(adminUser.id, adminUser);
    this.users.set(managerUser.id, managerUser);

    const categories: Omit<Category, "id">[] = [
      {
        slug: "bathrobes",
        nameEn: "Bathrobes",
        nameRu: "Халаты",
        nameUz: "Xalatlar",
        descriptionEn: "Luxury cotton bathrobes for home and hospitality",
        descriptionRu: "Роскошные хлопковые халаты для дома и гостиничного бизнеса",
        descriptionUz: "Uy va mehmonxonalar uchun hashamatli paxta xalatlar",
        image: null,
        categoryType: "b2c",
      },
      {
        slug: "towels",
        nameEn: "Towels",
        nameRu: "Полотенца",
        nameUz: "Sochiqlar",
        descriptionEn: "Premium bath towels crafted with finest cotton",
        descriptionRu: "Премиальные банные полотенца из лучшего хлопка",
        descriptionUz: "Eng yaxshi paxtadan tayyorlangan premium hammom sochiqlari",
        image: null,
        categoryType: "b2c",
      },
      {
        slug: "pastel",
        nameEn: "Pastel Collection",
        nameRu: "Пастельная коллекция",
        nameUz: "Pastel kolleksiyasi",
        descriptionEn: "Elegant gift boxes and pastel-toned textile sets",
        descriptionRu: "Элегантные подарочные наборы и текстиль в пастельных тонах",
        descriptionUz: "Nafis sovg'a qutilari va pastel rangdagi tekstil to'plamlari",
        image: null,
        categoryType: "b2c",
      },
      {
        slug: "spa-hotel",
        nameEn: "Spa & Hotel",
        nameRu: "Спа и Отели",
        nameUz: "Spa va Mehmonxonalar",
        descriptionEn: "Professional-grade textiles for hospitality industry",
        descriptionRu: "Профессиональный текстиль для индустрии гостеприимства",
        descriptionUz: "Mehmondo'stlik sohasi uchun professional tekstil",
        image: null,
        categoryType: "b2b",
      },
      {
        slug: "barber",
        nameEn: "Barber Shop",
        nameRu: "Барбершоп",
        nameUz: "Sartaroshxona",
        descriptionEn: "Premium towels and capes for professional barber shops",
        descriptionRu: "Премиальные полотенца и накидки для профессиональных барбершопов",
        descriptionUz: "Professional sartaroshxonalar uchun premium sochiqlar va pelerinlar",
        image: null,
        categoryType: "b2b",
      },
      {
        slug: "accessories",
        nameEn: "Accessories",
        nameRu: "Аксессуары",
        nameUz: "Aksessuarlar",
        descriptionEn: "Slippers, towel sets, gift boxes, and storage bags",
        descriptionRu: "Тапочки, наборы полотенец, подарочные коробки и сумки для хранения",
        descriptionUz: "Shippak, sochiq to'plamlari, sovg'a qutilari va saqlash sumkalari",
        image: null,
        categoryType: "b2c",
      },
    ];

    for (const category of categories) {
      const id = this.nextCategoryId++;
      this.categories.set(id, { id, ...category });
    }

    const defaultProducts: Omit<Product, "id">[] = [
      { categoryId: 1, slug: "classic-bathrobe", nameEn: "Classic Cotton Bathrobe", nameRu: "Классический хлопковый халат", nameUz: "Klassik paxta xalat", descriptionEn: "Luxurious cotton bathrobe in cream color", descriptionRu: "Роскошный хлопковый халат кремового цвета", descriptionUz: "Krem rangidagi hashamatli paxta xalat", materialEn: "100% Premium Egyptian Cotton", materialRu: "100% Премиальный египетский хлопок", materialUz: "100% Premium Misr paxtasi", careEn: "Machine wash cold, tumble dry low", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL", colors: "Cream,Beige,White", images: "bathrobe-1", featured: true },
      { categoryId: 1, slug: "spa-bathrobe", nameEn: "Spa Luxury Bathrobe", nameRu: "Спа-халат люкс", nameUz: "Spa hashamat xalati", descriptionEn: "Premium spa bathrobe in soft pastel tones", descriptionRu: "Премиальный спа-халат в мягких пастельных тонах", descriptionUz: "Yumshoq pastel ranglardagi premium spa xalati", materialEn: "100% Organic Cotton", materialRu: "100% Органический хлопок", materialUz: "100% Organik paxta", careEn: "Machine wash cold", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL,XXL", colors: "Light Pink,Mint,Lavender", images: "bathrobe-2", featured: true },
      { categoryId: 1, slug: "velour-bathrobe", nameEn: "Velour Touch Bathrobe", nameRu: "Велюровый халат", nameUz: "Velur xalat", descriptionEn: "Ultra-soft velour bathrobe", descriptionRu: "Ультрамягкий велюровый халат", descriptionUz: "O'ta yumshoq velur xalat", materialEn: "Cotton Velour Blend", materialRu: "Хлопковый велюр", materialUz: "Paxta velur aralashmasi", careEn: "Gentle cycle, hang dry", careRu: "Деликатная стирка", careUz: "Nozik yuvish", sizes: "M,L,XL", colors: "Taupe,Gray,Ivory", images: "bathrobe-3", featured: false },
      { categoryId: 2, slug: "bath-towel-set", nameEn: "Premium Bath Towel Set", nameRu: "Премиум набор банных полотенец", nameUz: "Premium hammom sochiq to'plami", descriptionEn: "Set of luxurious bath towels", descriptionRu: "Набор роскошных банных полотенец", descriptionUz: "Hashamatli hammom sochiqlari to'plami", materialEn: "100% Long-Staple Cotton", materialRu: "100% Длинноволокнистый хлопок", materialUz: "100% Uzun tolali paxta", careEn: "Machine wash warm", careRu: "Машинная стирка в теплой воде", careUz: "Iliq suvda yuvish", sizes: "Standard,Large", colors: "White,Cream,Sand", images: "towel-1", featured: true },
      { categoryId: 2, slug: "hand-towels", nameEn: "Elegant Hand Towels", nameRu: "Элегантные полотенца для рук", nameUz: "Nafis qo'l sochiqlari", descriptionEn: "Soft and absorbent hand towels", descriptionRu: "Мягкие и впитывающие полотенца", descriptionUz: "Yumshoq va singdiruvchi sochiqlar", materialEn: "Turkish Cotton", materialRu: "Турецкий хлопок", materialUz: "Turk paxtasi", careEn: "Machine wash", careRu: "Машинная стирка", careUz: "Mashina yuvish", sizes: "Standard", colors: "Blush,Sage,Stone", images: "towel-2", featured: false },
      { categoryId: 2, slug: "luxury-towel-collection", nameEn: "Luxury Towel Collection", nameRu: "Коллекция люксовых полотенец", nameUz: "Hashamatli sochiqlar kolleksiyasi", descriptionEn: "Complete luxury bathroom towel set", descriptionRu: "Полный набор роскошных полотенец", descriptionUz: "To'liq hashamatli hammom sochiq to'plami", materialEn: "Zero-Twist Cotton", materialRu: "Хлопок Zero-Twist", materialUz: "Zero-Twist paxta", careEn: "Machine wash cold", careRu: "Машинная стирка холодной водой", careUz: "Sovuq suvda yuvish", sizes: "Set of 6", colors: "Natural,Oatmeal,Pearl", images: "towel-3", featured: true },
      { categoryId: 3, slug: "pastel-gift-box", nameEn: "Pastel Gift Box", nameRu: "Подарочный набор Пастель", nameUz: "Pastel sovg'a qutisi", descriptionEn: "Elegant gift box with towels and robe in pastel colors", descriptionRu: "Элегантный подарочный набор с полотенцами и халатом в пастельных тонах", descriptionUz: "Pastel rangdagi sochiq va xalat bilan nafis sovg'a qutisi", materialEn: "100% Premium Cotton", materialRu: "100% Премиальный хлопок", materialUz: "100% Premium paxta", careEn: "Machine wash cold", careRu: "Машинная стирка", careUz: "Sovuq suvda yuvish", sizes: "One Size", colors: "Blush Pink,Sage Green,Lavender", images: "pastel-1", featured: true },
      { categoryId: 4, slug: "hotel-bathrobe-white", nameEn: "Hotel Collection Bathrobe", nameRu: "Гостиничный халат", nameUz: "Mehmonxona xalati", descriptionEn: "Professional-grade bathrobe for hotels and spas", descriptionRu: "Профессиональный халат для отелей и спа", descriptionUz: "Mehmonxona va spa uchun professional xalat", materialEn: "Heavy-duty Cotton Terry", materialRu: "Плотная хлопковая махра", materialUz: "Og'ir vazifali paxta maxsa", careEn: "Industrial wash safe", careRu: "Подходит для промышленной стирки", careUz: "Sanoat yuvishga mos", sizes: "S,M,L,XL,XXL", colors: "White,Ivory", images: "hotel-1", featured: true },
      { categoryId: 5, slug: "barber-towel-set", nameEn: "Barber Professional Towel Set", nameRu: "Профессиональный набор полотенец для барбера", nameUz: "Professional sartarosh sochiq to'plami", descriptionEn: "Premium towels designed for professional barber use", descriptionRu: "Премиальные полотенца для профессионального использования в барбершопах", descriptionUz: "Professional sartarosh foydalanishi uchun premium sochiqlar", materialEn: "Quick-dry Cotton Blend", materialRu: "Быстросохнущая хлопковая смесь", materialUz: "Tez quriydigan paxta aralashmasi", careEn: "Machine wash hot, tumble dry", careRu: "Машинная стирка в горячей воде", careUz: "Issiq suvda yuvish", sizes: "Standard", colors: "Black,White,Gray", images: "barber-1", featured: true },
      { categoryId: 6, slug: "luxury-slippers", nameEn: "Luxury Spa Slippers", nameRu: "Люксовые спа-тапочки", nameUz: "Hashamatli spa shippaklar", descriptionEn: "Comfortable slippers for home and spa use", descriptionRu: "Комфортные тапочки для дома и спа", descriptionUz: "Uy va spa uchun qulay shippaklar", materialEn: "Cotton Terry Upper, Non-slip Sole", materialRu: "Махровый верх, нескользящая подошва", materialUz: "Maxsali yuza, sirg'anmaydigan taglik", careEn: "Hand wash", careRu: "Ручная стирка", careUz: "Qo'lda yuvish", sizes: "S/M,L/XL", colors: "White,Cream,Gray", images: "slippers-1", featured: false },
    ];

    for (const product of defaultProducts) {
      const id = this.nextProductId++;
      this.products.set(id, { id, ...product });
    }

    this.upsertSetting("ai_assistant_enabled", "true");
    this.upsertSetting("contact_phone", "+998 88 259 94 44");
    this.upsertSetting("contact_email", "info@marycollection.com");
    this.upsertSetting("contact_address_en", "Istiqbol MFY, Turakurgan street, Namangan city, Uzbekistan");
    this.upsertSetting("contact_address_ru", "Истикбол МФЙ, улица Туракурган, город Наманган, Узбекистан");
    this.upsertSetting("contact_address_uz", "Istiqbol MFY, Turakurgan ko'chasi, Namangan shahri, O'zbekiston");
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: "manager" };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.role = role;
    return user;
  }

  async updateUserPassword(id: string, password: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.password = password;
    return user;
  }

  async updateUserCredentials(id: string, username: string, password: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.username = username;
    user.password = password;
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return user.password === password;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find((c) => c.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.nextCategoryId++;
    const newCategory: Category = { 
      id, 
      slug: category.slug,
      nameUz: category.nameUz,
      nameRu: category.nameRu,
      nameEn: category.nameEn,
      descriptionUz: category.descriptionUz ?? null,
      descriptionRu: category.descriptionRu ?? null,
      descriptionEn: category.descriptionEn ?? null,
      image: category.image ?? null,
      categoryType: category.categoryType ?? null,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    this.categories.delete(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find((p) => p.slug === slug);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.categoryId === categoryId);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.nextProductId++;
    const newProduct: Product = { 
      id, 
      slug: product.slug,
      categoryId: product.categoryId,
      nameUz: product.nameUz,
      nameRu: product.nameRu,
      nameEn: product.nameEn,
      descriptionUz: product.descriptionUz ?? null,
      descriptionRu: product.descriptionRu ?? null,
      descriptionEn: product.descriptionEn ?? null,
      materialUz: product.materialUz ?? null,
      materialRu: product.materialRu ?? null,
      materialEn: product.materialEn ?? null,
      careUz: product.careUz ?? null,
      careRu: product.careRu ?? null,
      careEn: product.careEn ?? null,
      sizes: product.sizes ?? null,
      colors: product.colors ?? null,
      images: product.images ?? null,
      featured: product.featured ?? null,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.nextInquiryId++;
    const newInquiry: Inquiry = { 
      id, 
      name: inquiry.name,
      email: inquiry.email,
      message: inquiry.message,
      phone: inquiry.phone ?? null,
      productId: inquiry.productId ?? null,
      status: "new", 
      createdAt: new Date() 
    };
    this.inquiries.set(id, newInquiry);
    return newInquiry;
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const existing = this.inquiries.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, status };
    this.inquiries.set(id, updated);
    return updated;
  }

  async deleteInquiry(id: number): Promise<void> {
    this.inquiries.delete(id);
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.nextLeadId++;
    const leadData = {
      leadType: lead.leadType || "b2c",
      language: lead.language || "en",
      country: lead.country ?? null,
      source: lead.source,
      message: lead.message ?? null,
    };
    const score = calculateLeadScore(leadData);
    const now = new Date();
    const newLead: Lead = { 
      id, 
      phone: lead.phone,
      email: lead.email ?? null,
      name: lead.name ?? null,
      source: lead.source,
      page: lead.page ?? null,
      leadType: lead.leadType || "b2c",
      language: lead.language || "en",
      score,
      status: lead.status || "new",
      businessType: lead.businessType ?? null,
      productType: lead.productType ?? null,
      estimatedQuantity: lead.estimatedQuantity ?? null,
      message: lead.message ?? null,
      aiSummary: lead.aiSummary ?? null,
      country: lead.country ?? null,
      createdAt: now,
      updatedAt: now,
      crmId: null,
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const existing = this.leads.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...lead, updatedAt: new Date() };
    if (lead.leadType || lead.language || lead.country || lead.message) {
      updated.score = calculateLeadScore(updated);
    }
    this.leads.set(id, updated);
    return updated;
  }

  async updateLeadStatus(id: number, status: string): Promise<Lead | undefined> {
    const existing = this.leads.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, status, updatedAt: new Date() };
    this.leads.set(id, updated);
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    this.leads.delete(id);
  }

  async getSiteContent(): Promise<SiteContent[]> {
    return Array.from(this.siteContent.values());
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    return this.siteContent.get(key);
  }

  async upsertSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const existing = this.siteContent.get(content.key);
    if (existing) {
      const updated: SiteContent = { 
        ...existing, 
        key: content.key,
        valueUz: content.valueUz ?? null,
        valueRu: content.valueRu ?? null,
        valueEn: content.valueEn ?? null,
      };
      this.siteContent.set(content.key, updated);
      return updated;
    }
    const id = this.nextContentId++;
    const newContent: SiteContent = { 
      id, 
      key: content.key,
      valueUz: content.valueUz ?? null,
      valueRu: content.valueRu ?? null,
      valueEn: content.valueEn ?? null,
    };
    this.siteContent.set(content.key, newContent);
    return newContent;
  }

  async getSettings(): Promise<Settings[]> {
    return Array.from(this.settings.values());
  }

  async getSettingByKey(key: string): Promise<Settings | undefined> {
    return this.settings.get(key);
  }

  async upsertSetting(key: string, value: string): Promise<Settings> {
    const existing = this.settings.get(key);
    if (existing) {
      const updated = { ...existing, value };
      this.settings.set(key, updated);
      return updated;
    }
    const id = this.nextSettingId++;
    const newSetting: Settings = { id, key, value };
    this.settings.set(key, newSetting);
    return newSetting;
  }
}

export const storage = new MemStorage();
