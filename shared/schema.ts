import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  company: varchar("company"),
  phoneNumber: varchar("phone_number"),
  location: varchar("location"),
  businessType: varchar("business_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tender categories
export const tenderCategories = pgTable("tender_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tenders table
export const tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  organization: varchar("organization", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  budgetEstimate: integer("budget_estimate"),
  deadline: date("deadline").notNull(),
  publishDate: date("publish_date").defaultNow(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, closed, cancelled
  requirements: text("requirements").array(),
  documents: text("documents").array(),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  tenderNumber: varchar("tender_number"),
  sourceUrl: varchar("source_url"),
  scrapedFrom: varchar("scraped_from"), // mygov, tenders.go.ke, sheets, manual
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved tenders (user favorites)
export const savedTenders = pgTable("saved_tenders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  tenderId: integer("tender_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Consortiums
export const consortiums = pgTable("consortiums", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  tenderId: integer("tender_id"),
  createdBy: varchar("created_by").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, closed, submitted
  maxMembers: integer("max_members").default(10),
  requiredSkills: text("required_skills").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Consortium members
export const consortiumMembers = pgTable("consortium_members", {
  id: serial("id").primaryKey(),
  consortiumId: integer("consortium_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("member"), // admin, member, pending
  expertise: varchar("expertise", { length: 200 }),
  contribution: text("contribution"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Service providers
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  specialization: varchar("specialization", { length: 200 }).notNull(),
  description: text("description"),
  experience: integer("experience"), // years
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  hourlyRate: integer("hourly_rate"),
  availability: varchar("availability", { length: 50 }).default("available"), // available, busy, unavailable
  certifications: text("certifications").array(),
  portfolio: text("portfolio").array(),
  profileImage: varchar("profile_image"),
  website: varchar("website"),
  linkedIn: varchar("linkedin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI analyses for tenders
export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  tenderId: integer("tender_id").notNull(),
  estimatedValueMin: integer("estimated_value_min"),
  estimatedValueMax: integer("estimated_value_max"),
  winProbability: integer("win_probability"), // percentage
  recommendations: text("recommendations").array(),
  confidenceScore: integer("confidence_score"), // percentage
  analysisData: jsonb("analysis_data"), // raw AI response data
  modelVersion: varchar("model_version"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User alerts and notifications
export const userAlerts = pgTable("user_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // tender_match, deadline_reminder, consortium_invite
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // additional data like tender_id, consortium_id
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  savedTenders: many(savedTenders),
  consortiums: many(consortiums),
  consortiumMemberships: many(consortiumMembers),
  serviceProviders: many(serviceProviders),
  alerts: many(userAlerts),
}));

export const tendersRelations = relations(tenders, ({ many, one }) => ({
  savedByUsers: many(savedTenders),
  consortiums: many(consortiums),
  aiAnalysis: one(aiAnalyses, {
    fields: [tenders.id],
    references: [aiAnalyses.tenderId],
  }),
}));

export const savedTendersRelations = relations(savedTenders, ({ one }) => ({
  user: one(users, {
    fields: [savedTenders.userId],
    references: [users.id],
  }),
  tender: one(tenders, {
    fields: [savedTenders.tenderId],
    references: [tenders.id],
  }),
}));

export const consortiumsRelations = relations(consortiums, ({ one, many }) => ({
  creator: one(users, {
    fields: [consortiums.createdBy],
    references: [users.id],
  }),
  tender: one(tenders, {
    fields: [consortiums.tenderId],
    references: [tenders.id],
  }),
  members: many(consortiumMembers),
}));

export const consortiumMembersRelations = relations(consortiumMembers, ({ one }) => ({
  consortium: one(consortiums, {
    fields: [consortiumMembers.consortiumId],
    references: [consortiums.id],
  }),
  user: one(users, {
    fields: [consortiumMembers.userId],
    references: [users.id],
  }),
}));

export const serviceProvidersRelations = relations(serviceProviders, ({ one }) => ({
  user: one(users, {
    fields: [serviceProviders.userId],
    references: [users.id],
  }),
}));

export const aiAnalysesRelations = relations(aiAnalyses, ({ one }) => ({
  tender: one(tenders, {
    fields: [aiAnalyses.tenderId],
    references: [tenders.id],
  }),
}));

export const userAlertsRelations = relations(userAlerts, ({ one }) => ({
  user: one(users, {
    fields: [userAlerts.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertTenderCategorySchema = createInsertSchema(tenderCategories).omit({
  id: true,
  createdAt: true,
});

export const insertTenderSchema = createInsertSchema(tenders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavedTenderSchema = createInsertSchema(savedTenders).omit({
  id: true,
  createdAt: true,
});

export const insertConsortiumSchema = createInsertSchema(consortiums).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsortiumMemberSchema = createInsertSchema(consortiumMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertServiceProviderSchema = createInsertSchema(serviceProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiAnalysisSchema = createInsertSchema(aiAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertUserAlertSchema = createInsertSchema(userAlerts).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type TenderCategory = typeof tenderCategories.$inferSelect;
export type InsertTenderCategory = z.infer<typeof insertTenderCategorySchema>;

export type Tender = typeof tenders.$inferSelect;
export type InsertTender = z.infer<typeof insertTenderSchema>;

export type SavedTender = typeof savedTenders.$inferSelect;
export type InsertSavedTender = z.infer<typeof insertSavedTenderSchema>;

export type Consortium = typeof consortiums.$inferSelect;
export type InsertConsortium = z.infer<typeof insertConsortiumSchema>;

export type ConsortiumMember = typeof consortiumMembers.$inferSelect;
export type InsertConsortiumMember = z.infer<typeof insertConsortiumMemberSchema>;

export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;

export type AiAnalysis = typeof aiAnalyses.$inferSelect;
export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;

export type UserAlert = typeof userAlerts.$inferSelect;
export type InsertUserAlert = z.infer<typeof insertUserAlertSchema>;
