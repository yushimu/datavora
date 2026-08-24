import * as dotenv from "dotenv";
dotenv.config();

if (process.env.DATABASE_URL?.startsWith('"') && process.env.DATABASE_URL?.endsWith('"')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.slice(1, -1);
}

import { db } from "./src/db/index.js";
import { services } from "./src/db/schema.js";

const defaultServices = [
  {
    icon: "LineChart",
    title: "Financial Dashboard",
    description: "Automated P&L, cash flow forecasting, and budget tracking with visual charts."
  },
  {
    icon: "Package",
    title: "Inventory Management",
    description: "Track stock levels, set reorder points, and analyze COGS across multiple locations."
  },
  {
    icon: "Users",
    title: "HR Attendance",
    description: "Manage employee shifts, calculate overtime, and track leave balances automatically."
  },
  {
    icon: "Briefcase",
    title: "Sales CRM",
    description: "Lightweight, customizable pipeline tracker to close deals and manage client data."
  },
  {
    icon: "LayoutDashboard",
    title: "KPI Executive Dashboard",
    description: "High-level metrics and performance indicators consolidated into one clean view."
  },
  {
    icon: "Code",
    title: "Google Sheets Automation",
    description: "Custom Apps Script to connect APIs, send automated emails, and run background tasks."
  }
];

async function seed() {
  try {
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      for (const s of defaultServices) {
        await db.insert(services).values(s);
      }
      console.log("Seeded services successfully!");
    } else {
      console.log("Services already exist, skipping.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
