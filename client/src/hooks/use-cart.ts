import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CartItem, type InsertCartItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  return useQuery({
    queryKey: [api.cart.list.path],
    queryFn: async () => {
      const res = await fetch(api.cart.list.path, { credentials: "include" });
      if (res.status === 401) return []; // Guest user
      if (!res.ok) throw new Error("Failed to fetch cart");
      return await res.json() as (CartItem & { product: any })[]; // Extended type with product details
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "userId">) => {
      const res = await fetch(api.cart.addItem.path, {
        method: api.cart.addItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "include",
      });
      
      if (res.status === 401) {
        throw new Error("Please login to add items to cart");
      }
      if (!res.ok) throw new Error("Failed to add to cart");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
      toast({
        title: "Added to cart",
        description: "Your item has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes("login")) {
        window.location.href = "/login";
      }
    }
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cart.removeItem.path, { id });
      const res = await fetch(url, {
        method: api.cart.removeItem.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
  });
}
