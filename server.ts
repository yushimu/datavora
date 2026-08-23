import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./src/db";
import { admins, products, portfolio, services, testimonials } from "./src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev";

// Make app a top-level instance so it can be exported
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Auth API
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Lazy admin creation if no admins exist
    const existingAdmins = await db.select().from(admins).limit(1);
    if (existingAdmins.length === 0) {
      if (username === "admin" && password === "admin123") {
        const hash = await bcrypt.hash("admin123", 10);
        const newUser = await db.insert(admins).values({ username: "admin", passwordHash: hash }).returning();
        const token = jwt.sign({ id: newUser[0].id }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("admin_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        return res.json({ success: true, message: "Default admin created" });
      } else {
        return res.status(401).json({ error: "No admin configured yet. Use default credentials." });
      }
    }

    const userRes = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
    const user = userRes[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("admin_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});

app.get("/api/admin/check", (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.json({ authenticated: false });
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (e) {
    res.json({ authenticated: false });
  }
});

// Middleware to protect routes
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Products API (Public Read)
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Products API (Protected Write)
app.post("/api/products", requireAuth, async (req, res) => {
  try {
    const newProduct = await db.insert(products).values(req.body).returning();
    res.json(newProduct[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/products/:id", requireAuth, async (req, res) => {
  try {
    const updated = await db.update(products).set(req.body).where(eq(products.id, parseInt(req.params.id as string))).returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/products/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(products).where(eq(products.id, parseInt(req.params.id as string)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Portfolio API (Public Read)
app.get("/api/portfolio", async (req, res) => {
  try {
    const allPortfolio = await db.select().from(portfolio);
    res.json(allPortfolio);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Portfolio API (Protected Write)
app.post("/api/portfolio", requireAuth, async (req, res) => {
  try {
    const newItem = await db.insert(portfolio).values(req.body).returning();
    res.json(newItem[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/portfolio/:id", requireAuth, async (req, res) => {
  try {
    const updated = await db.update(portfolio).set(req.body).where(eq(portfolio.id, parseInt(req.params.id as string))).returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/portfolio/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(portfolio).where(eq(portfolio.id, parseInt(req.params.id as string)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Services API
app.get("/api/services", async (req, res) => {
  try {
    const allServices = await db.select().from(services);
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/services", requireAuth, async (req, res) => {
  try {
    const newItem = await db.insert(services).values(req.body).returning();
    res.json(newItem[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/services/:id", requireAuth, async (req, res) => {
  try {
    const updated = await db.update(services).set(req.body).where(eq(services.id, parseInt(req.params.id as string))).returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/services/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(services).where(eq(services.id, parseInt(req.params.id as string)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Testimonials API
app.get("/api/testimonials", async (req, res) => {
  try {
    const allTestimonials = await db.select().from(testimonials);
    res.json(allTestimonials);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/testimonials", requireAuth, async (req, res) => {
  try {
    const newItem = await db.insert(testimonials).values(req.body).returning();
    res.json(newItem[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/testimonials/:id", requireAuth, async (req, res) => {
  try {
    const updated = await db.update(testimonials).set(req.body).where(eq(testimonials.id, parseInt(req.params.id as string))).returning();
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(testimonials).where(eq(testimonials.id, parseInt(req.params.id as string)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Service Gallery API
app.get("/api/service-gallery", async (req, res) => {
  try {
    const allImages = await db.select().from(schema.serviceGallery);
    res.json(allImages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/service-gallery", requireAuth, async (req, res) => {
  try {
    const newItem = await db.insert(schema.serviceGallery).values(req.body).returning();
    res.json(newItem[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/service-gallery/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(schema.serviceGallery).where(eq(schema.serviceGallery.id, parseInt(req.params.id as string)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Setup Vite and start server only if not running on Vercel
if (!process.env.VERCEL) {
  const startLocalServer = async () => {
    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: { port: 0 }
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*all", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startLocalServer();
}

// Export the app for Vercel serverless function
export default app;
