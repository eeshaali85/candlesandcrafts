import { useState, useEffect, useCallback } from "react";
import { type Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export interface LocalCartItem {
  productId: number;
  quantity: number;
  product: Product;
}

const CART_KEY = "candlesandcrafts_cart";

function getStoredCart(): LocalCartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: LocalCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function useCart() {
  const [items, setItems] = useState<LocalCartItem[]>(getStoredCart);

  useEffect(() => {
    const handler = () => setItems(getStoredCart());
    window.addEventListener("cart-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { data: items, isLoading: false };
}

export function useAddToCart() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (input: { productId: number; quantity: number }) => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/products/${input.productId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Product not found");
      const product: Product = await res.json();

      const cart = getStoredCart();
      const existing = cart.find((i) => i.productId === input.productId);
      if (existing) {
        existing.quantity += input.quantity;
      } else {
        cart.push({ productId: input.productId, quantity: input.quantity, product });
      }
      saveCart(cart);
      window.dispatchEvent(new Event("open-cart-drawer"));
      toast({
        title: "Added to cart",
        description: "Your item has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }, [toast]);

  return { mutate, isPending };
}

export function useUpdateCartQuantity() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(({ id, quantity }: { id: number; quantity: number }) => {
    setIsPending(true);
    const cart = getStoredCart();
    const item = cart.find((i) => i.productId === id);
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }
    setIsPending(false);
  }, []);

  return { mutate, isPending };
}

export function useAddBouquetToCart() {
  const { toast } = useToast();

  const addBouquet = useCallback((opts: {
    productId: number;
    name: string;
    price: number;
    image?: string;
    quantity: number;
  }) => {
    const syntheticProduct: Product = {
      id: opts.productId,
      name: opts.name,
      description: "Custom handcrafted candle bouquet",
      price: String(opts.price),
      image: opts.image ?? "",
      category: "bouquet",
      series: null,
      stock: 999,
    };
    const cart = getStoredCart();
    const existing = cart.find((i) => i.productId === opts.productId);
    if (existing) {
      existing.quantity += opts.quantity;
      existing.product = syntheticProduct;
    } else {
      cart.push({ productId: opts.productId, quantity: opts.quantity, product: syntheticProduct });
    }
    saveCart(cart);
    window.dispatchEvent(new Event("open-cart-drawer"));
    toast({ title: "Added to cart", description: `${opts.name.split(" – ")[0]} has been added to your cart.` });
  }, [toast]);

  return { addBouquet };
}

export function useRemoveFromCart() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback((productId: number) => {
    setIsPending(true);
    const cart = getStoredCart().filter((i) => i.productId !== productId);
    saveCart(cart);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
    setIsPending(false);
  }, [toast]);

  return { mutate, isPending };
}

export function clearLocalCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}
