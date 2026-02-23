import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, X } from "lucide-react";
import { Link } from "wouter";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { data: cartItems } = useCart();
  const removeItem = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  ) || 0;

  const handleQuantityChange = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity.mutate({ id: productId, quantity: newQty });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col p-0 gap-0 [&>button]:hidden">
        <SheetHeader className="px-6 py-5 border-b border-border flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-semibold tracking-wide uppercase">Shopping Cart</SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:opacity-70 transition-opacity"
            data-testid="button-close-cart-drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {(!cartItems || cartItems.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground text-sm mb-4">Your cart is empty</p>
              <Link href="/shop" onClick={() => onOpenChange(false)}>
                <Button variant="outline" size="sm" data-testid="button-drawer-shop">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4" data-testid={`drawer-cart-item-${item.productId}`}>
                  <Link href={`/product/${item.productId}`} onClick={() => onOpenChange(false)}>
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 border border-border/50 cursor-pointer">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold leading-tight mb-0.5 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground capitalize mb-2">
                      {item.product.category?.replace(/-/g, " ")}
                    </p>
                    <p className="text-sm font-medium mb-2">
                      Rs.{Number(item.product.price).toLocaleString()}.00
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                          data-testid={`drawer-decrease-${item.productId}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium" data-testid={`drawer-qty-${item.productId}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          data-testid={`drawer-increase-${item.productId}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem.mutate(item.productId)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`drawer-remove-${item.productId}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-3">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm font-medium">Subtotal:</span>
              <span className="text-base font-semibold">Rs.{subtotal.toLocaleString()}.00 PKR</span>
            </div>

            <Link href="/cart" onClick={() => onOpenChange(false)}>
              <Button
                variant="outline"
                className="w-full h-11 rounded-none border-foreground text-foreground font-semibold text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                data-testid="button-drawer-view-cart"
              >
                View Cart <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/shop" onClick={() => onOpenChange(false)}>
              <Button
                variant="outline"
                className="w-full h-11 rounded-none border-foreground text-foreground font-semibold text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors mt-2"
                data-testid="button-drawer-continue-shopping"
              >
                Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/checkout" onClick={() => onOpenChange(false)}>
              <Button
                className="w-full h-11 rounded-none bg-foreground text-background font-semibold text-xs uppercase tracking-widest hover:bg-foreground/90 mt-2"
                data-testid="button-drawer-checkout"
              >
                Check Out
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
