import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Order, type GuestCheckoutInput } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { clearLocalCart } from "@/hooks/use-cart";

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
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: GuestCheckoutInput) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to place order");
      }
      return await res.json();
    },
    onSuccess: () => {
      clearLocalCart();
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
