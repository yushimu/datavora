import { db } from "./src/db/index";
import * as schema from "./src/db/schema";
async function run() {
  try {
    await db.select().from(schema.serviceGallery);
    console.log("OK");
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
