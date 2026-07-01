import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  users, products, cartItems, orders, orderItems, newsletterSubscribers,
  type User, type InsertUser, type Product, type CartItem, type Order, type InsertCartItem, type CheckoutDetails, type NewsletterSubscriber
} from "@shared/schema";

export interface IStorage {
  // User (Auth)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: Partial<Product>): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Cart
  getCart(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Orders
  createOrder(userId: number | null, total: number, items: { productId: number; quantity: number; price: number }[], details: CheckoutDetails): Promise<Order>;
  updateCartQuantity(id: number, quantity: number): Promise<CartItem>;
  getOrders(userId: number): Promise<(Order & { items: (typeof orderItems.$inferSelect & { product: Product })[] })[]>;
  getAllOrders(): Promise<(Order & { items: (typeof orderItems.$inferSelect & { product: Product })[] })[]>;

  // Newsletter
  addSubscriber(email: string): Promise<NewsletterSubscriber>;
  getSubscribers(): Promise<NewsletterSubscriber[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product as any).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const [updated] = await db.update(products).set(product as any).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getCart(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await db.select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
    
    return items;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if exists
    const [existing] = await db.select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, item.userId!), eq(cartItems.productId, item.productId!)));

    if (existing) {
      const [updated] = await db.update(cartItems)
        .set({ quantity: existing.quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async updateCartQuantity(id: number, quantity: number): Promise<CartItem> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async createOrder(userId: number | null, total: number, items: { productId: number; quantity: number; price: number }[], details: CheckoutDetails): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        userId,
        total: total.toString(),
        status: "pending",
        email: details.email || null,
        firstName: details.firstName,
        lastName: details.lastName,
        phone: details.phone,
        address: details.address,
        apartment: details.apartment || null,
        city: details.city,
        postalCode: details.postalCode || null,
        paymentMethod: details.paymentMethod,
        notes: details.notes || null,
      }).returning();

      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString()
        });
      }

      return order;
    });
  }

  async getOrders(userId: number): Promise<(Order & { items: (typeof orderItems.$inferSelect & { product: Product })[] })[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    return this._populateOrderItems(userOrders);
  }

  async getAllOrders(): Promise<(Order & { items: (typeof orderItems.$inferSelect & { product: Product })[] })[]> {
    const allOrders = await db.select().from(orders).orderBy(orders.createdAt);
    return this._populateOrderItems(allOrders);
  }

  async addSubscriber(email: string): Promise<NewsletterSubscriber> {
    const [existing] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    if (existing) return existing;
    const [sub] = await db.insert(newsletterSubscribers).values({ email }).returning();
    return sub;
  }

  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers).orderBy(newsletterSubscribers.createdAt);
  }

  private async _populateOrderItems(orderList: Order[]) {
    const result = [];
    for (const order of orderList) {
      const items = await db.select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: products
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));
      result.push({ ...order, items });
    }
    return result;
  }
}

export const storage = new DatabaseStorage();
