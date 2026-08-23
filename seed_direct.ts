import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import { pgTable, serial, varchar, text, jsonb } from "drizzle-orm/pg-core";
import fs from "fs";

const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  categories: jsonb("categories").$type<string[]>().default([]),
  description: text("description").notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  image: text("image").default(''),
  images: jsonb("images").$type<string[]>().default([]),
});

const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description").notNull(),
  problem: text("problem").notNull(),
  solution: text("solution").notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  tools: jsonb("tools").notNull().$type<string[]>(),
  image: text("image").default(''),
  images: jsonb("images").$type<string[]>().default([]),
});

const pool = new Pool({
  connectionString: "postgresql://postgres.ncdobbdgtvdnxsotfzqa:DatavoraSuroya20@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

async function run() {
  try {
    // Alter table manually because drizzle-kit push prompts
    try {
      await pool.query('ALTER TABLE products DROP COLUMN IF EXISTS category CASCADE;');
      await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT \'[]\';');
      console.log("Altered products table");
    } catch (e) {
      console.log("Alter table warning:", e);
    }
    
    // Clear existing products and reseed
    await db.delete(products);
    console.log("Cleared existing products");

    const initialProducts = [
      {
        title: "Inventory Master Pro",
        categories: ["Dashboard", "Web App"],
        description: "Complex inventory tracking with automated reorder alerts and supplier management dashboard. Built for medium to large retail operations.",
        price: "$89",
        features: ["Real-time Tracking", "Supplier API", "Analytics", "Role-based Access"],
        image: "",
        images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"],
      },
      {
        title: "Finance Tracker Ultimate",
        categories: ["Tracker", "Dashboard", "Template"],
        description: "Comprehensive financial dashboard template with predictive budgeting and cash flow analysis. Connects directly to major bank APIs.",
        price: "$129",
        features: ["Bank Sync", "Predictive AI", "Tax Export", "Multi-currency"],
        image: "",
        images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"],
      },
      {
        title: "Data Model Architecture v2",
        categories: ["Data Model"],
        description: "Enterprise-grade data model schemas for E-commerce platforms. Includes ERD diagrams, SQL scripts, and migration guides.",
        price: "$149",
        features: ["PostgreSQL Ready", "Normalized", "Documentation", "Migration Scripts"],
        image: "",
        images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"],
      }
    ];

    for (const prod of initialProducts) {
      await db.insert(products).values(prod);
    }
    console.log("Seeded products with multiple categories");

    const portfolioDataStr = fs.readFileSync("./src/data/portfolio.json", "utf8");
    const portfolioData = JSON.parse(portfolioDataStr);
    
    const existingPortfolio = await db.select().from(portfolio);
    if (existingPortfolio.length === 0) {
      for (const p of portfolioData) {
        const { id, ...rest } = p;
        await db.insert(portfolio).values(rest);
      }
      console.log("Seeded portfolio");
    }
    
    const categoriesToSeed = ['Dashboard', 'Template', 'Tracker', 'Web App', 'Data Model'];
    for (const cat of categoriesToSeed) {
      await db.insert(productCategories).values({ name: cat }).onConflictDoNothing();
    }
    console.log("Seeded categories");
    
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}
run();
