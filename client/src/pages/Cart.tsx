import { useCart, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowRight, ShoppingBag, Minus, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const removeItem = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  ) || 0;

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
          <Button size="lg" className="rounded-full px-8" data-testid="button-start-shopping">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity.mutate({ id: productId, quantity: newQty });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-8">Your Cart</h1>

        <div className="border-b border-border pb-2 mb-6 hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
          <span>Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
          <span className="w-8" />
        </div>

        <div className="space-y-0 divide-y divide-border">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="py-6 flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center"
              data-testid={`cart-item-${item.productId}`}
            >
              <div className="flex gap-4 items-center w-full">
                <Link href={`/product/${item.productId}`}>
                  <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 border border-border/50 cursor-pointer">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">
                    <Link href={`/product/${item.productId}`}>{item.product.name}</Link>
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.product.category?.replace(/-/g, " ")}</p>
                  <p className="text-sm text-muted-foreground mt-1">Rs.{Number(item.product.price).toLocaleString()}.00</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center border border-border rounded-full">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                    data-testid={`button-decrease-${item.productId}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.productId}`}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    data-testid={`button-increase-${item.productId}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-sm font-semibold text-right" data-testid={`text-item-price-${item.productId}`}>
                Rs.{(Number(item.product.price) * item.quantity).toLocaleString()}.00
              </p>

              <button
                onClick={() => removeItem.mutate(item.productId)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                data-testid={`button-remove-${item.productId}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-2 pt-6">
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-baseline gap-6">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-xl font-semibold" data-testid="text-cart-total">Rs.{subtotal.toLocaleString()}.00 PKR</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
            <div className="flex gap-3 mt-2">
              <Link href="/shop">
                <Button variant="outline" className="rounded-none border-foreground uppercase text-xs tracking-widest font-semibold h-11 px-6" data-testid="button-continue-shopping-cart">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/checkout">
                <Button className="rounded-none bg-foreground text-background uppercase text-xs tracking-widest font-semibold h-11 px-8 hover:bg-foreground/90" data-testid="button-proceed-checkout">
                  Check Out <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
