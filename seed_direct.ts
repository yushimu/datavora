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
  category: varchar("category", { length: 255 }).default('Uncategorized'),
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

const initialProducts = [
  {
    title: "FinDash Pro",
    description: "Automated financial dashboard for SaaS startups. Track MRR, Churn, and LTV automatically.",
    price: "$149",
    features: [
      "Automated Stripe Integration",
      "P&L Statement Generator",
      "Cash Flow Forecasting",
      "One-click PDF Export"
    ]
  },
  {
    title: "Inventory Master",
    description: "Complex inventory tracking with automated reorder alerts and supplier management.",
    price: "$89",
    features: [
      "Barcode Scanner Compatible",
      "Low Stock Email Alerts",
      "Supplier Database",
      "Historical Trends"
    ]
  },
  {
    title: "HR Ops Hub",
    description: "Complete employee lifecycle management, from onboarding to performance reviews.",
    price: "$129",
    features: [
      "Onboarding Checklists",
      "Time-off Tracker",
      "Performance Review Templates",
      "Salary Band Calculator"
    ]
  }
];

async function run() {
  try {
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      for (const p of initialProducts) {
        await db.insert(products).values(p);
      }
      console.log("Seeded products");
    }

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
