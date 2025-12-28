import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type User } from "@shared/schema";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401 || res.status === 403) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json() as User;
    },
    retry: false,
  });
}
