import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, X, Check, Package, ShoppingBag, LogOut, ChevronDown, ChevronUp } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  series: string | null;
  stock: number | null;
};

type OrderItem = {
  id: number;
  orderId: number | null;
  productId: number | null;
  quantity: number;
  price: string;
  product: Product;
};

type Order = {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  address: string;
  city: string;
  total: string;
  status: string;
  paymentMethod: string;
  notes: string | null;
  createdAt: string | null;
  items: OrderItem[];
};

const CATEGORIES = ["jar-candles", "pillar-candles", "bouquets", "gift-sets", "ceramics"];
const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "jar-candles",
  series: "",
  stock: "0",
};

export default function Admin() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<typeof emptyForm>(emptyForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<typeof emptyForm>(emptyForm);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const { data: session, isLoading: sessionLoading } = useQuery<{
    authenticated: boolean;
    isAdmin: boolean;
    userId?: string;
  }>({
    queryKey: ["/api/admin/me"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    enabled: session?.isAdmin === true,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: session?.isAdmin === true && tab === "orders",
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      apiRequest("POST", "/api/admin/products", {
        ...data,
        price: data.price,
        stock: Number(data.stock),
        series: data.series || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowAddForm(false);
      setAddForm(emptyForm);
      toast({ title: "Product added" });
    },
    onError: () => toast({ title: "Failed to add product", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof emptyForm }) =>
      apiRequest("PATCH", `/api/admin/products/${id}`, {
        ...data,
        price: data.price,
        stock: Number(data.stock),
        series: data.series || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingId(null);
      toast({ title: "Product updated" });
    },
    onError: () => toast({ title: "Failed to update product", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
    onError: () => toast({ title: "Failed to delete product", variant: "destructive" }),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/admin/orders/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Order updated" });
    },
    onError: () => toast({ title: "Failed to update order", variant: "destructive" }),
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm p-8 bg-white rounded-2xl shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-500 mb-6 text-sm">You need to log in with your Replit account to continue.</p>
          <a
            href="/api/login"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Log in with Replit
          </a>
        </div>
      </div>
    );
  }

  if (!session?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm p-8 bg-white rounded-2xl shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4 text-sm">
            Your account isn't set up as admin yet. Copy your user ID below and set it as the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">ADMIN_USER_ID</code> environment variable.
          </p>
          <div className="bg-gray-100 rounded-lg px-4 py-3 text-xs font-mono text-gray-700 break-all mb-4 text-left">
            {session.userId}
          </div>
          <p className="text-xs text-gray-400">After setting the env variable, restart the app and refresh this page.</p>
        </div>
      </div>
    );
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      series: p.series || "",
      stock: String(p.stock ?? 0),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">C&C Admin</span>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">← View Store</a>
          <a href="/api/logout" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl border p-1 w-fit">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "products" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "orders" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders
          </button>
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Products <span className="text-gray-400 font-normal text-sm">({products?.length ?? 0})</span>
              </h2>
              <button
                onClick={() => { setShowAddForm(true); setAddForm(emptyForm); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-white border rounded-2xl p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-4">New Product</h3>
                <ProductForm
                  form={addForm}
                  onChange={setAddForm}
                  onSave={() => createMutation.mutate(addForm)}
                  onCancel={() => setShowAddForm(false)}
                  saving={createMutation.isPending}
                />
              </div>
            )}

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="bg-white border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Stock</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products?.map((p) =>
                      editingId === p.id ? (
                        <tr key={p.id} className="bg-blue-50">
                          <td colSpan={5} className="px-4 py-4">
                            <ProductForm
                              form={editForm}
                              onChange={setEditForm}
                              onSave={() => updateMutation.mutate({ id: p.id, data: editForm })}
                              onCancel={() => setEditingId(null)}
                              saving={updateMutation.isPending}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{p.name}</div>
                                {p.series && <div className="text-xs text-gray-400">{p.series}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.category}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Rs.{Number(p.price).toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.stock ?? 0}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(p)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Orders <span className="text-gray-400 font-normal text-sm">({orders?.length ?? 0})</span>
            </h2>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : orders?.length === 0 ? (
              <div className="bg-white border rounded-2xl p-12 text-center text-gray-400">No orders yet.</div>
            ) : (
              <div className="space-y-3">
                {[...(orders ?? [])].reverse().map((order) => (
                  <div key={order.id} className="bg-white border rounded-2xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            #{order.id} — {order.firstName} {order.lastName}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—"} · {order.phone} · {order.city}
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "cancelled" ? "bg-red-100 text-red-700" :
                          order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">Rs.{Number(order.total).toLocaleString()}</span>
                        {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="border-t px-5 py-4 bg-gray-50 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <div className="text-gray-400 text-xs mb-0.5">Address</div>
                            <div className="text-gray-800">{order.address}{order.city ? `, ${order.city}` : ""}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs mb-0.5">Payment</div>
                            <div className="text-gray-800">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</div>
                          </div>
                          {order.email && (
                            <div>
                              <div className="text-gray-400 text-xs mb-0.5">Email</div>
                              <div className="text-gray-800">{order.email}</div>
                            </div>
                          )}
                          {order.notes && (
                            <div className="col-span-2 md:col-span-3">
                              <div className="text-gray-400 text-xs mb-0.5">Notes</div>
                              <div className="text-gray-800">{order.notes}</div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border">
                              <span className="text-gray-800">{item.product?.name ?? "Unknown"} × {item.quantity}</span>
                              <span className="font-medium text-gray-900">Rs.{(Number(item.price) * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">Update status:</span>
                          <select
                            defaultValue={order.status}
                            onChange={(e) => updateOrderMutation.mutate({ id: order.id, status: e.target.value })}
                            className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  form: typeof emptyForm;
  onChange: (f: typeof emptyForm) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...form, [field]: e.target.value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
        <input value={form.name} onChange={set("name")} placeholder="Product name" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
        <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Short description" className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs.) *</label>
        <input value={form.price} onChange={set("price")} placeholder="e.g. 1700.00" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
        <input type="number" value={form.stock} onChange={set("stock")} min="0" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
        <select value={form.category} onChange={set("category")} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Series</label>
        <input value={form.series} onChange={set("series")} placeholder="e.g. Amber Series" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
        <input value={form.image} onChange={set("image")} placeholder="/images/my-candle.jpg" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
      </div>
      <div className="md:col-span-2 flex items-center gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving || !form.name || !form.price}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );
}
