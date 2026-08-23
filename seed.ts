import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./src/db/index.js";
import { products, portfolio } from "./src/db/schema.js";
import portfolioData from "./src/data/portfolio.json" assert { type: "json" };

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

async function seed() {
  try {
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      for (const p of initialProducts) {
        await db.insert(products).values(p);
      }
      console.log("Seeded products");
    }

    const existingPortfolio = await db.select().from(portfolio);
    if (existingPortfolio.length === 0) {
      for (const p of portfolioData) {
        const { id, ...rest } = p;
        await db.insert(portfolio).values(rest);
      }
      console.log("Seeded portfolio");
    }
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
