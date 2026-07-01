import type { Express, RequestHandler } from "express";
import type { Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { guestCheckoutSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

const isAdmin: RequestHandler = (req, res, next) => {
  if (!(req.session as any).adminLoggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Replit Auth
  setupAuth(app);

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email required" });
    }
    try {
      const sub = await storage.addSubscriber(email);
      res.json({ message: "Subscribed", subscriber: sub });
    } catch (err) {
      console.error("Newsletter error:", err);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Get all subscribers (admin only)
  app.get("/api/newsletter/subscribers", isAdmin, async (_req, res) => {
    const subscribers = await storage.getSubscribers();
    res.json(subscribers);
  });

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  // Cart
  app.get(api.cart.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const cart = await storage.getCart(req.user!.id);
    res.json(cart);
  });

  app.post(api.cart.addItem.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.cart.addItem.input.parse({ ...req.body, userId: req.user!.id });
      const item = await storage.addToCart(input);
      res.json(item);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  app.patch(api.cart.updateItem.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = api.cart.updateItem.input.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid quantity" });
    const item = await storage.updateCartQuantity(Number(req.params.id), parsed.data.quantity);
    res.json(item);
  });

  app.delete(api.cart.removeItem.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.removeFromCart(Number(req.params.id));
    res.sendStatus(200);
  });

  // Orders (guest checkout supported)
  app.post(api.orders.create.path, async (req, res) => {
    const parsed = guestCheckoutSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Please fill in all required details", errors: parsed.error.flatten() });

    const { items: cartItems, ...details } = parsed.data;

    const productPrices: { productId: number; quantity: number; price: number }[] = [];
    let total = 0;
    for (const cartItem of cartItems) {
      const product = await storage.getProduct(cartItem.productId);
      if (!product) return res.status(400).json({ message: `Product #${cartItem.productId} not found` });
      const price = Number(product.price);
      total += price * cartItem.quantity;
      productPrices.push({ productId: cartItem.productId, quantity: cartItem.quantity, price });
    }

    const userId = req.isAuthenticated() ? (req.user as any).id : null;
    const order = await storage.createOrder(userId, total, productPrices, details);
    res.status(201).json(order);
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders(req.user!.id);
    res.json(orders);
  });
  
  // Auth user endpoint for frontend
  app.get(api.auth.me.path, (req, res) => {
    res.json(req.user || null);
  });

  // ── Customer Auth ────────────────────────────────────────────────────────────
  app.post("/api/auth/signup", async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const existing = await storage.getUserByUsername(username);
    if (existing) return res.status(409).json({ message: "Username already taken" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await storage.createUser({ username, password: hashed, email: email || null, firstName: firstName || null, lastName: lastName || null, phone: null, address: null, city: null });
    (req.session as any).customerId = user.id;
    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid username or password" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid username or password" });
    (req.session as any).customerId = user.id;
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/auth/logout", (req, res) => {
    (req.session as any).customerId = null;
    res.json({ ok: true });
  });

  app.get("/api/auth/customer", async (req, res) => {
    const id = (req.session as any).customerId;
    if (!id) return res.status(401).json(null);
    const user = await storage.getUser(id);
    if (!user) return res.status(401).json(null);
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  });

  app.patch("/api/auth/profile", async (req, res) => {
    const id = (req.session as any).customerId;
    if (!id) return res.status(401).json({ message: "Not logged in" });
    const { email, firstName, lastName, phone, address, city } = req.body;
    const updated = await storage.updateUserProfile(id, { email, firstName, lastName, phone, address, city });
    const { password: _, ...safeUser } = updated;
    res.json(safeUser);
  });

  // ── Admin: password-based login (no Replit dependency) ──────────────────────
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass) {
      return res.status(500).json({ message: "ADMIN_PASSWORD not configured" });
    }
    if (username === adminUser && password === adminPass) {
      (req.session as any).adminLoggedIn = true;
      return res.json({ ok: true });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminLoggedIn = false;
    res.json({ ok: true });
  });

  // ── Admin: current session info (used by frontend to check access) ──────────
  app.get("/api/admin/me", (req, res) => {
    const loggedIn = !!(req.session as any).adminLoggedIn;
    res.json({ authenticated: loggedIn, isAdmin: loggedIn });
  });

  // ── Admin: Products ──────────────────────────────────────────────────────────
  app.get("/api/admin/products", isAdmin, async (req, res) => {
    const prods = await storage.getProducts();
    res.json(prods);
  });

  app.post("/api/admin/products", isAdmin, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  app.patch("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(Number(req.params.id), req.body);
      res.json(product);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(Number(req.params.id));
      res.sendStatus(204);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  // ── Admin: Orders ────────────────────────────────────────────────────────────
  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    const allOrders = await storage.getAllOrders();
    res.json(allOrders);
  });

  app.patch("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: "status required" });
      await storage.updateOrderStatus(Number(req.params.id), status);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

const SERIES_IMAGES: Record<string, string> = {
  "Mini Moments Series":  "/images/mini-moments-v2-opt.jpg",
  "Aurora Series":        "/images/aurora-series-opt.jpg",
  "Eclipse Series":       "/images/eclipse-series-opt.jpg",
  "Amber Series":         "/images/amber-series-opt.jpg",
  "Signature Luxe Series":"/images/luxe-series-opt.jpg",
};

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    await storage.createProduct({
      name: "Mini Moments Series",
      description: "Petite shot glass jar candle, perfect for small spaces. Available in 7 signature scents.",
      price: "800.00",
      category: "jar-candles",
      series: "Mini Moments Series",
      image: SERIES_IMAGES["Mini Moments Series"],
      stock: 50
    });
    await storage.createProduct({
      name: "Aurora Series",
      description: "Elegant mini gold jar candle with a warm glow. Available in 7 signature scents.",
      price: "1700.00",
      category: "jar-candles",
      series: "Aurora Series",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    await storage.createProduct({
      name: "Eclipse Series",
      description: "Sophisticated black jar candle for modern spaces. Available in 7 signature scents.",
      price: "2200.00",
      category: "jar-candles",
      series: "Eclipse Series",
      image: SERIES_IMAGES["Eclipse Series"],
      stock: 50
    });
    await storage.createProduct({
      name: "Amber Series",
      description: "Classic amber jar candle with rich, warm fragrance. Available in 7 signature scents.",
      price: "2700.00",
      category: "jar-candles",
      series: "Amber Series",
      image: SERIES_IMAGES["Amber Series"],
      stock: 50
    });
    await storage.createProduct({
      name: "Signature Luxe Series",
      description: "Elegant lidded jar candle for the discerning collector. Available in 7 signature scents.",
      price: "3200.00",
      category: "jar-candles",
      series: "Signature Luxe Series",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    console.log("Database seeded with jar candle series!");
  } else {
    // Always keep images up to date for named series
    for (const product of existing) {
      const newImage = product.series ? SERIES_IMAGES[product.series] : undefined;
      if (newImage && product.image !== newImage) {
        await storage.updateProduct(product.id, { image: newImage });
        console.log(`Updated image for ${product.series}`);
      }
    }
  }
}
