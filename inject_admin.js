import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import bcrypt from "bcryptjs";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

const pool = new Pool({
  connectionString: "postgresql://postgres.ncdobbdgtvdnxsotfzqa:DatavoraSuroya20@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

async function run() {
  try {
    const existing = await db.select().from(admins);
    console.log("Existing admins:", existing.map(a => a.username));
    
    if (existing.length > 0) {
      await db.delete(admins);
      console.log("Deleted old admins.");
    }

    const hash = await bcrypt.hash("SuksesBers@m@Allah2030", 10);
    await db.insert(admins).values({ username: "datavora_admin", passwordHash: hash });
    console.log("SUCCESS: New admin created!");
  } catch (err) {
    console.error("ERROR:", err);
  }
  process.exit(0);
}
run();
