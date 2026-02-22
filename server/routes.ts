import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { checkoutDetailsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Replit Auth
  setupAuth(app);

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

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const cart = await storage.getCart(req.user!.id);
    if (cart.length === 0) return res.status(400).json({ message: "Cart empty" });

    const parsed = checkoutDetailsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Please fill in all required details", errors: parsed.error.flatten() });

    const total = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const items = cart.map(item => ({
      productId: item.productId!,
      quantity: item.quantity,
      price: Number(item.product.price)
    }));

    const order = await storage.createOrder(req.user!.id, total, items, parsed.data);
    await storage.clearCart(req.user!.id);
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

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    // Jar Candles - 5 Series
    await storage.createProduct({
      name: "Mini Moments Series",
      description: "Petite shot glass jar candle, perfect for small spaces. Available in 7 signature scents.",
      price: "850.00",
      category: "jar-candles",
      series: "Mini Moments Series",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    await storage.createProduct({
      name: "Aurora Series",
      description: "Elegant mini gold jar candle with a warm glow. Available in 7 signature scents.",
      price: "1250.00",
      category: "jar-candles",
      series: "Aurora Series",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    await storage.createProduct({
      name: "Eclipse Series",
      description: "Sophisticated black jar candle for modern spaces. Available in 7 signature scents.",
      price: "1650.00",
      category: "jar-candles",
      series: "Eclipse Series",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    await storage.createProduct({
      name: "Amber Series",
      description: "Classic amber jar candle with rich, warm fragrance. Available in 7 signature scents.",
      price: "2450.00",
      category: "jar-candles",
      series: "Amber Series",
      image: "/images/candles-collection.jpeg",
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
  }
}
