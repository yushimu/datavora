import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./src/db/index";
import { admins } from "./src/db/schema";
import bcrypt from "bcryptjs";

async function run() {
  try {
    const allAdmins = await db.select().from(admins);
    console.log("Existing admins in Supabase:", allAdmins.map(a => a.username));
    
    // If there is an admin but it's not the new one, let's just delete all and recreate the new one
    if (allAdmins.length > 0) {
      console.log("Deleting old admins to apply new credentials...");
      await db.delete(admins);
    }

    const hash = await bcrypt.hash("SuksesBers@m@Allah2030", 10);
    await db.insert(admins).values({ username: "datavora_admin", passwordHash: hash });
    console.log("✅ New admin 'datavora_admin' successfully created in Supabase!");

  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
run();
