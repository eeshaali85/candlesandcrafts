import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path, { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch orders");
      return await res.json() as Order[];
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Empty body as cart is used
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to place order");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.cart.list.path] });
      toast({
        title: "Order Placed!",
        description: "Thank you for your purchase.",
      });
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
