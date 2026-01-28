import type {
  User, InsertUser,
  Category, InsertCategory,
  Product, InsertProduct,
  Inquiry, InsertInquiry,
  SiteContent, InsertSiteContent,
  Settings, InsertSettings,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
  private siteContent: Map<string, SiteContent>;
  private settings: Map<string, Settings>;
  private nextCategoryId = 1;
  private nextProductId = 1;
  private nextInquiryId = 1;
  private nextContentId = 1;
  private nextSettingId = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.inquiries = new Map();
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
    this.users.set(adminUser.id, adminUser);

    const bathrobes: Category = {
      id: this.nextCategoryId++,
      slug: "bathrobes",
      nameEn: "Bathrobes",
      nameRu: "Халаты",
      nameUz: "Xalatlar",
      descriptionEn: "Luxury cotton bathrobes",
      descriptionRu: "Роскошные хлопковые халаты",
      descriptionUz: "Hashamatli paxta xalatlar",
      image: null,
    };
    const towels: Category = {
      id: this.nextCategoryId++,
      slug: "towels",
      nameEn: "Towels",
      nameRu: "Полотенца",
      nameUz: "Sochiqlar",
      descriptionEn: "Premium bath towels",
      descriptionRu: "Премиальные банные полотенца",
      descriptionUz: "Premium hammom sochiqlari",
      image: null,
    };
    this.categories.set(bathrobes.id, bathrobes);
    this.categories.set(towels.id, towels);

    const defaultProducts: Omit<Product, "id">[] = [
      { categoryId: 1, slug: "classic-bathrobe", nameEn: "Classic Cotton Bathrobe", nameRu: "Классический хлопковый халат", nameUz: "Klassik paxta xalat", descriptionEn: "Luxurious cotton bathrobe in cream color", descriptionRu: "Роскошный хлопковый халат кремового цвета", descriptionUz: "Krem rangidagi hashamatli paxta xalat", materialEn: "100% Premium Egyptian Cotton", materialRu: "100% Премиальный египетский хлопок", materialUz: "100% Premium Misr paxtasi", careEn: "Machine wash cold, tumble dry low", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL", colors: "Cream,Beige,White", images: "bathrobe-1", featured: true },
      { categoryId: 1, slug: "spa-bathrobe", nameEn: "Spa Luxury Bathrobe", nameRu: "Спа-халат люкс", nameUz: "Spa hashamat xalati", descriptionEn: "Premium spa bathrobe in soft pastel tones", descriptionRu: "Премиальный спа-халат в мягких пастельных тонах", descriptionUz: "Yumshoq pastel ranglardagi premium spa xalati", materialEn: "100% Organic Cotton", materialRu: "100% Органический хлопок", materialUz: "100% Organik paxta", careEn: "Machine wash cold", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL,XXL", colors: "Light Pink,Mint,Lavender", images: "bathrobe-2", featured: true },
      { categoryId: 1, slug: "velour-bathrobe", nameEn: "Velour Touch Bathrobe", nameRu: "Велюровый халат", nameUz: "Velur xalat", descriptionEn: "Ultra-soft velour bathrobe", descriptionRu: "Ультрамягкий велюровый халат", descriptionUz: "O'ta yumshoq velur xalat", materialEn: "Cotton Velour Blend", materialRu: "Хлопковый велюр", materialUz: "Paxta velur aralashmasi", careEn: "Gentle cycle, hang dry", careRu: "Деликатная стирка", careUz: "Nozik yuvish", sizes: "M,L,XL", colors: "Taupe,Gray,Ivory", images: "bathrobe-3", featured: false },
      { categoryId: 2, slug: "bath-towel-set", nameEn: "Premium Bath Towel Set", nameRu: "Премиум набор банных полотенец", nameUz: "Premium hammom sochiq to'plami", descriptionEn: "Set of luxurious bath towels", descriptionRu: "Набор роскошных банных полотенец", descriptionUz: "Hashamatli hammom sochiqlari to'plami", materialEn: "100% Long-Staple Cotton", materialRu: "100% Длинноволокнистый хлопок", materialUz: "100% Uzun tolali paxta", careEn: "Machine wash warm", careRu: "Машинная стирка в теплой воде", careUz: "Iliq suvda yuvish", sizes: "Standard,Large", colors: "White,Cream,Sand", images: "towel-1", featured: true },
      { categoryId: 2, slug: "hand-towels", nameEn: "Elegant Hand Towels", nameRu: "Элегантные полотенца для рук", nameUz: "Nafis qo'l sochiqlari", descriptionEn: "Soft and absorbent hand towels", descriptionRu: "Мягкие и впитывающие полотенца", descriptionUz: "Yumshoq va singdiruvchi sochiqlar", materialEn: "Turkish Cotton", materialRu: "Турецкий хлопок", materialUz: "Turk paxtasi", careEn: "Machine wash", careRu: "Машинная стирка", careUz: "Mashina yuvish", sizes: "Standard", colors: "Blush,Sage,Stone", images: "towel-2", featured: false },
      { categoryId: 2, slug: "luxury-towel-collection", nameEn: "Luxury Towel Collection", nameRu: "Коллекция люксовых полотенец", nameUz: "Hashamatli sochiqlar kolleksiyasi", descriptionEn: "Complete luxury bathroom towel set", descriptionRu: "Полный набор роскошных полотенец", descriptionUz: "To'liq hashamatli hammom sochiq to'plami", materialEn: "Zero-Twist Cotton", materialRu: "Хлопок Zero-Twist", materialUz: "Zero-Twist paxta", careEn: "Machine wash cold", careRu: "Машинная стирка холодной водой", careUz: "Sovuq suvda yuvish", sizes: "Set of 6", colors: "Natural,Oatmeal,Pearl", images: "towel-3", featured: true },
    ];

    for (const product of defaultProducts) {
      const id = this.nextProductId++;
      this.products.set(id, { id, ...product });
    }

    this.upsertSetting("ai_assistant_enabled", "true");
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: "admin" };
    this.users.set(id, user);
    return user;
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
    const newCategory: Category = { id, ...category };
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
    const newProduct: Product = { id, ...product };
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
    const newInquiry: Inquiry = { id, ...inquiry, status: "new", createdAt: new Date() };
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

  async getSiteContent(): Promise<SiteContent[]> {
    return Array.from(this.siteContent.values());
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    return this.siteContent.get(key);
  }

  async upsertSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const existing = this.siteContent.get(content.key);
    if (existing) {
      const updated = { ...existing, ...content };
      this.siteContent.set(content.key, updated);
      return updated;
    }
    const id = this.nextContentId++;
    const newContent: SiteContent = { id, ...content };
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
