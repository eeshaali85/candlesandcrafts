import { useUser } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package, Calendar } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (userLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-muted-foreground">Manage your orders and account settings.</p>
        </div>

        <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          Order History
        </h2>

        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm border border-border p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-border/50">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Order ID</span>
                    <span className="font-mono font-medium text-lg">#{order.id.toString().padStart(6, '0')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(order.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block mb-1">Total</span>
                    <span className="font-bold text-xl text-primary">Rs.{Number(order.total).toLocaleString()}.00 PKR</span>
                  </div>
                </div>
                
                {/* Order Items Preview would go here if available in the expanded order object */}
                <div className="text-sm text-muted-foreground italic">
                  Order details are being processed.
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-border border-dashed">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No orders yet</h3>
              <p className="text-muted-foreground">Once you place an order, it will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
