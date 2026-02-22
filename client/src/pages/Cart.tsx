import { useCart, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, ArrowRight, ShoppingBag, Minus, Plus, CheckCircle, Package } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { checkoutDetailsSchema, type CheckoutDetails } from "@shared/schema";

type CartStep = "cart" | "checkout" | "confirmation";

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const { data: user } = useUser();
  const removeItem = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const createOrder = useCreateOrder();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<CartStep>("cart");
  const [formData, setFormData] = useState<CheckoutDetails>({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  ) || 0;

  const total = subtotal;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (step === "confirmation" && confirmedOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2 text-center max-w-md">
          Thank you, {formData.customerName}! Your order #{confirmedOrder.id} has been placed successfully.
        </p>
        <p className="text-muted-foreground mb-8 text-center max-w-md text-sm">
          We'll reach out to you at {formData.phone} to confirm delivery details.
          Please allow 7-10 days for dispatch.
        </p>
        <div className="bg-muted rounded-xl p-6 mb-8 w-full max-w-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground text-sm">Order Total</span>
            <span className="font-semibold text-[#c45e4c]" data-testid="text-order-total">Rs.{Number(confirmedOrder.total).toLocaleString()}.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground text-sm">Delivery To</span>
            <span className="text-sm text-right">{formData.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Status</span>
            <span className="text-sm flex items-center gap-1">
              <Package className="w-3 h-3" /> Processing
            </span>
          </div>
        </div>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8" data-testid="button-continue-shopping">Continue Shopping</Button>
        </Link>
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

  const handleQuantityChange = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity.mutate({ id: itemId, quantity: newQty });
  };

  const validateForm = () => {
    const result = checkoutDetailsSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    createOrder.mutate(formData, {
      onSuccess: (order) => {
        setConfirmedOrder(order);
        setStep("confirmation");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-10 text-center sm:text-left">
          {step === "cart" ? "Your Cart" : "Checkout"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {step === "cart" && (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white dark:bg-card rounded-xl shadow-sm border border-border/40"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <Link href={`/product/${item.product.id}`}>
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden flex-shrink-0 border border-border cursor-pointer">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-serif text-base sm:text-lg font-bold truncate">
                            <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                          </h3>
                          <p className="font-semibold text-base sm:text-lg text-[#c45e4c] whitespace-nowrap" data-testid={`text-item-price-${item.id}`}>
                            Rs.{(Number(item.product.price) * item.quantity).toLocaleString()}.00
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground capitalize">{item.product.category?.replace("-", " ")}</p>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-muted-foreground/20 rounded-sm bg-muted w-fit">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1.5 transition-colors text-muted-foreground disabled:opacity-40"
                            disabled={item.quantity <= 1 || updateQuantity.isPending}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm text-foreground" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1.5 transition-colors text-muted-foreground"
                            disabled={updateQuantity.isPending}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground -mr-2"
                          onClick={() => removeItem.mutate(item.id)}
                          disabled={removeItem.isPending}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {step === "checkout" && (
              <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border/40 p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold mb-6">Delivery Details</h2>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="customerName" className="text-sm text-muted-foreground mb-1.5 block">Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="e.g. Ayesha Khan"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className={formErrors.customerName ? "border-destructive" : ""}
                      data-testid="input-customer-name"
                    />
                    {formErrors.customerName && <p className="text-xs text-destructive mt-1">{formErrors.customerName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-muted-foreground mb-1.5 block">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="e.g. 0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={formErrors.phone ? "border-destructive" : ""}
                      data-testid="input-phone"
                    />
                    {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm text-muted-foreground mb-1.5 block">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g. Lahore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={formErrors.city ? "border-destructive" : ""}
                      data-testid="input-city"
                    />
                    {formErrors.city && <p className="text-xs text-destructive mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm text-muted-foreground mb-1.5 block">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="House/Flat no., Street, Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={formErrors.address ? "border-destructive" : ""}
                      rows={3}
                      data-testid="input-address"
                    />
                    {formErrors.address && <p className="text-xs text-destructive mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm text-muted-foreground mb-1.5 block">Order Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for your order..."
                      value={formData.notes || ""}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      data-testid="input-notes"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Order Summary</h3>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 text-sm">
                      <span className="text-foreground">{item.product.name} x{item.quantity}</span>
                      <span className="text-muted-foreground">Rs.{(Number(item.product.price) * item.quantity).toLocaleString()}.00</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-card rounded-2xl shadow-lg border border-border/50 p-6 sm:p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6">
                {step === "cart" ? "Order Summary" : "Total"}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                  <span>Rs.{subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-xs italic">Calculated on confirmation</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span data-testid="text-cart-total">Rs.{total.toLocaleString()}.00</span>
                </div>
              </div>

              {step === "cart" ? (
                <>
                  <Button
                    onClick={() => {
                      if (!user) {
                        window.location.href = "/api/login";
                        return;
                      }
                      setStep("checkout");
                    }}
                    className="w-full h-12 text-base rounded-xl"
                    data-testid="button-proceed-checkout"
                  >
                    {user ? "Proceed to Checkout" : "Sign In to Checkout"} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href="/shop">
                    <Button variant="ghost" className="w-full mt-3 text-muted-foreground" data-testid="button-continue-shopping-cart">
                      Continue Shopping
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={createOrder.isPending}
                    className="w-full h-12 text-base rounded-xl"
                    data-testid="button-place-order"
                  >
                    {createOrder.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    {createOrder.isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full mt-3 text-muted-foreground"
                    onClick={() => setStep("cart")}
                    data-testid="button-back-to-cart"
                  >
                    Back to Cart
                  </Button>
                </>
              )}

              <p className="text-xs text-center mt-4 text-muted-foreground">
                Cash on delivery available across Pakistan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
