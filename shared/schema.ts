import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  image: text("image"),
  categoryType: text("category_type").default("b2c"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  slug: text("slug").notNull().unique(),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  materialUz: text("material_uz"),
  materialRu: text("material_ru"),
  materialEn: text("material_en"),
  careUz: text("care_uz"),
  careRu: text("care_ru"),
  careEn: text("care_en"),
  sizes: text("sizes"),
  colors: text("colors"),
  images: text("images"),
  featured: boolean("featured").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true, status: true });
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  email: text("email"),
  name: text("name"),
  source: text("source").notNull(),
  page: text("page"),
  leadType: text("lead_type").notNull().default("b2c"),
  language: text("language").notNull().default("en"),
  score: integer("score").notNull().default(0),
  status: text("status").notNull().default("new"),
  businessType: text("business_type"),
  productType: text("product_type"),
  estimatedQuantity: text("estimated_quantity"),
  message: text("message"),
  aiSummary: text("ai_summary"),
  country: text("country"),
  crmId: text("crm_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, updatedAt: true, crmId: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const LeadStatus = {
  NEW: "new",
  QUALIFIED: "qualified",
  CONTACTED: "contacted",
  NEEDS_PROPOSAL: "needs_proposal",
  OFFER_SENT: "offer_sent",
  NEGOTIATION: "negotiation",
  WON: "won",
  LOST: "lost",
} as const;

export const LeadType = {
  B2C: "b2c",
  SPA_B2B: "spa_b2b",
  BARBER_B2B: "barber_b2b",
  BULK_B2B: "bulk_b2b",
  EXPORT: "export",
} as const;

export const LeadSource = {
  AI_CHAT: "ai_chat",
  CONTACT_FORM: "contact_form",
  BULK_ORDER: "bulk_order",
  EXPORT_FORM: "export_form",
} as const;

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueUz: text("value_uz"),
  valueRu: text("value_ru"),
  valueEn: text("value_en"),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({ id: true });
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'page_view', 'product_click', 'chat_usage', 'visitor'
  page: text("page"),
  productId: integer("product_id"),
  sessionId: text("session_id"),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  metadata: text("metadata"), // JSON string for extra info
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true, createdAt: true });
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export interface GlobalContact {
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  addressEn: string;
  addressRu: string;
  addressUz: string;
}

export function calculateLeadScore(lead: {
  leadType: string;
  language: string;
  country?: string | null;
  source: string;
  message?: string | null;
}): number {
  let score = 30;

  if (lead.leadType === LeadType.SPA_B2B) score += 30;
  if (lead.leadType === LeadType.BARBER_B2B) score += 25;
  if (lead.leadType === LeadType.BULK_B2B) score += 30;
  if (lead.leadType === LeadType.EXPORT) score += 25;

  if (lead.language === "en") score += 10;

  if (lead.country && lead.country.toLowerCase() !== "uzbekistan" && lead.country.toLowerCase() !== "o'zbekiston") {
    score += 20;
  }

  const msg = (lead.message || "").toLowerCase();
  const priceOnlyPattern = /^(price|narx|цена|qancha|сколько|how much)\??$/i;
  if (priceOnlyPattern.test(msg.trim())) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

export function getLeadTemperature(score: number): "HOT" | "WARM" | "COLD" {
  if (score >= 80) return "HOT";
  if (score >= 50) return "WARM";
  return "COLD";
}
