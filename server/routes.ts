import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
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

    const total = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const orderItems = cart.map(item => ({
      productId: item.productId!,
      quantity: item.quantity,
      price: Number(item.product.price)
    }));

    const order = await storage.createOrder(req.user!.id, total, orderItems);
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
    await storage.createProduct({
      name: "Ocean Breeze",
      description: "A refreshing blend of honeydew and fresh citrus.",
      price: "24.00",
      category: "Fresh",
      image: "/images/candles-hero.jpeg", // Use one of the user images
      stock: 50
    });
    await storage.createProduct({
      name: "Toasted Vanilla",
      description: "Warm amber and sandalwood notes.",
      price: "24.00",
      category: "Warm",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    await storage.createProduct({
      name: "Espresso Shot",
      description: "Rich coffee and tonka bean.",
      price: "24.00",
      category: "Warm",
      image: "/images/candles-collection.jpeg",
      stock: 50
    });
    console.log("Database seeded!");
  }
}
