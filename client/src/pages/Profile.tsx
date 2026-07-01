import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, Calendar, User, LogOut, Pencil, Check, X } from "lucide-react";

type CustomerUser = {
  id: number;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
};

type Order = {
  id: number;
  total: string;
  status: string;
  createdAt: string | null;
  paymentMethod: string;
};

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<CustomerUser>>({});

  const { data: user, isLoading } = useQuery<CustomerUser | null>({
    queryKey: ["/api/auth/customer"],
    retry: false,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/customer"] });
      navigate("/login");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CustomerUser>) => apiRequest("PATCH", "/api/auth/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/customer"] });
      setEditing(false);
      toast({ title: "Details saved!" });
    },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const startEdit = () => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
    });
    setEditing(true);
  };

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-gray-900">My Account</h1>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.firstName || user.username}</p>
                <p className="text-xs text-gray-400">@{user.username}</p>
              </div>
            </div>
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border rounded-lg px-3 py-1.5 transition-colors"
                data-testid="button-edit-profile"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => updateMutation.mutate(form)}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-1.5 text-xs bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-800 disabled:opacity-50"
                  data-testid="button-save-profile"
                >
                  {updateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-50"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                ["Name", [user.firstName, user.lastName].filter(Boolean).join(" ") || "—"],
                ["Email", user.email || "—"],
                ["Phone", user.phone || "—"],
                ["City", user.city || "—"],
                ["Address", user.address || "—"],
              ].map(([label, value]) => (
                <div key={label} className={label === "Address" ? "col-span-2" : ""}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "First Name", key: "firstName" as const, span: false },
                { label: "Last Name", key: "lastName" as const, span: false },
                { label: "Email", key: "email" as const, span: true },
                { label: "Phone", key: "phone" as const, span: false },
                { label: "City", key: "city" as const, span: false },
                { label: "Address", key: "address" as const, span: true },
              ].map(({ label, key, span }) => (
                <div key={key} className={span ? "col-span-2" : ""}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    value={form[key] as string || ""}
                    onChange={field(key)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    data-testid={`input-${key}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" /> Order History
          </h2>
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-3">
              {[...(orders)].reverse().map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900">#{order.id}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Rs. {Number(order.total).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 capitalize">{order.paymentMethod.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 border-dashed p-12 text-center">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No orders yet</p>
              <a href="/shop" className="text-sm text-gray-700 underline mt-1 inline-block">Browse the shop</a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
