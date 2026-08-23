import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.ncdobbdgtvdnxsotfzqa:DatavoraSuroya20@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const queries = [
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS title_en varchar(255);",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en text;",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS features_en jsonb DEFAULT '[]';",
      
      "ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS title_en varchar(255);",
      "ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS category_en varchar(255);",
      "ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS description_en text;",
      "ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS problem_en text;",
      "ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS solution_en text;",
      "ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS features_en jsonb DEFAULT '[]';",
      
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS title_en varchar(255);",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS description_en text;",
      
      "ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS review_en text;"
    ];

    for (const q of queries) {
      await pool.query(q);
      console.log("Executed:", q);
    }
    console.log("Database altered successfully.");
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}
run();
