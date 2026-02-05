import { useCart, useRemoveFromCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const removeItem = useRemoveFromCart();
  const createOrder = useCreateOrder();

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  ) || 0;

  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Looks like you haven't added any handcrafted goodies yet.
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-10 text-center sm:text-left">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-6 p-6 bg-white rounded-xl shadow-sm border border-border/40 hover:border-primary/20 transition-all"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg font-bold hover:text-primary transition-colors">
                        <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                      </h3>
                      <p className="font-medium text-lg text-primary">
                        Rs.{(Number(item.product.price) * item.quantity).toLocaleString()}.00 PKR
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-md">
                      Qty: {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                      onClick={() => removeItem.mutate(item.id)}
                      disabled={removeItem.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}.00 PKR</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `Rs.${shipping.toLocaleString()}.00 PKR`}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-primary/80 bg-primary/10 p-2 rounded text-center">
                    Add Rs.{(50 - subtotal).toLocaleString()}.00 more for free shipping!
                  </div>
                )}
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}.00 PKR</span>
                </div>
              </div>

              <Button 
                onClick={() => createOrder.mutate()}
                disabled={createOrder.isPending}
                className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                {createOrder.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>Checkout <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
              
              <p className="text-xs text-center mt-4 text-muted-foreground">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
