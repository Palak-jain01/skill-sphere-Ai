import { boolean, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  headline: text("headline").notNull(),
  location: text("location").notNull(),
  goal: text("goal").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  progress: integer("progress").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const certificatesTable = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issuedDate: date("issued_date", { mode: "string" }).notNull(),
  credentialId: text("credential_id").notNull(),
  status: text("status").notNull().default("Verified"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const roadmapTable = pgTable("roadmap", {
  id: serial("id").primaryKey(),
  phase: text("phase").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  duration: text("duration").notNull(),
  skills: text("skills").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const opportunitiesTable = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  match: integer("match").notNull(),
  posted: text("posted").notNull(),
  tags: text("tags").array().notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  time: text("time").notNull(),
  kind: text("kind").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skillsTable).omit({ id: true, createdAt: true });
export const insertCertificateSchema = createInsertSchema(certificatesTable).omit({ id: true, createdAt: true });
export const insertRoadmapSchema = createInsertSchema(roadmapTable).omit({ id: true, createdAt: true });
export const insertOpportunitySchema = createInsertSchema(opportunitiesTable).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });

export type Profile = z.infer<typeof insertProfileSchema>;
export type Skill = z.infer<typeof insertSkillSchema>;
export type Certificate = z.infer<typeof insertCertificateSchema>;
export type RoadmapItem = z.infer<typeof insertRoadmapSchema>;
export type Opportunity = z.infer<typeof insertOpportunitySchema>;
export type Activity = z.infer<typeof insertActivitySchema>;