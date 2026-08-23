import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://postgres.ncdobbdgtvdnxsotfzqa:DatavoraSuroya20@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

pool.query("SELECT 1 as connected").then(res => {
  console.log("SUCCESS:", res.rows);
  process.exit(0);
}).catch(err => {
  console.error("CONNECTION ERROR:", err);
  process.exit(1);
});
