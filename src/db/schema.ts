import { pgTable, serial, varchar, text, integer, jsonb } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  title_en: varchar("title_en", { length: 255 }),
  categories: jsonb("categories").$type<string[]>().default([]),
  description: text("description").notNull(),
  description_en: text("description_en"),
  price: varchar("price", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  features_en: jsonb("features_en").$type<string[]>().default([]),
  image: text("image").default(''), // Change to text to support large base64 if needed
  images: jsonb("images").$type<string[]>().default([]),
});

export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  title_en: varchar("title_en", { length: 255 }),
  category: varchar("category", { length: 255 }).notNull(),
  category_en: varchar("category_en", { length: 255 }),
  description: text("description").notNull(),
  description_en: text("description_en"),
  problem: text("problem").notNull(),
  problem_en: text("problem_en"),
  solution: text("solution").notNull(),
  solution_en: text("solution_en"),
  features: jsonb("features").notNull().$type<string[]>(),
  features_en: jsonb("features_en").$type<string[]>().default([]),
  tools: jsonb("tools").notNull().$type<string[]>(),
  image: text("image").default(''),
  images: jsonb("images").$type<string[]>().default([]),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  title_en: varchar("title_en", { length: 255 }),
  description: text("description").notNull(),
  description_en: text("description_en"),
  icon: varchar("icon", { length: 50 }).default('CheckCircle2'),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  rating: integer("rating").default(5),
  review: text("review").notNull(),
  review_en: text("review_en"),
  photo: varchar("photo", { length: 255 }).default(''),
});

export const serviceGallery = pgTable("service_gallery", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});
