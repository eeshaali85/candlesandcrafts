import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ShoppingBag, CheckCircle, Package, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { checkoutDetailsSchema, type CheckoutDetails } from "@shared/schema";

const SHIPPING_COST = 300;

export default function Checkout() {
  const { data: cartItems, isLoading } = useCart();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState<CheckoutDetails>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  ) || 0;
  const total = subtotal + SHIPPING_COST;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2 text-center max-w-md">
          Thank you, {formData.firstName}! Your order #{confirmedOrder.id} has been placed successfully.
        </p>
        <p className="text-muted-foreground mb-8 text-center max-w-md text-sm">
          We'll reach out to you at {formData.phone} to confirm delivery details.
          Please allow 7-10 days for dispatch.
        </p>
        <div className="bg-muted rounded-xl p-6 mb-8 w-full max-w-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground text-sm">Order Total</span>
            <span className="font-semibold" data-testid="text-order-total">
              <span className="text-xs text-muted-foreground mr-1">PKR</span>
              Rs {Number(confirmedOrder.total).toLocaleString()}.00
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground text-sm">Delivery To</span>
            <span className="text-sm text-right">{formData.city}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground text-sm">Payment</span>
            <span className="text-sm">{formData.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Deposit"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Status</span>
            <span className="text-sm flex items-center gap-1">
              <Package className="w-3 h-3" /> Processing
            </span>
          </div>
        </div>
        {formData.paymentMethod === "bank_deposit" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full max-w-sm text-sm">
            <p className="font-medium mb-1">Please transfer the amount and share receipt via WhatsApp</p>
            <p className="text-muted-foreground">+92 322 4226665</p>
          </div>
        )}
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
        <h1 className="font-serif text-3xl font-bold mb-2">Nothing to check out</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Add some items to your cart first.
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8" data-testid="button-start-shopping">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const updateField = (field: keyof CheckoutDetails, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
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
    const orderInput = {
      ...formData,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    createOrder.mutate(orderInput, {
      onSuccess: (order) => {
        setConfirmedOrder(order);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold mb-4">Contact</h2>
              <div>
                <Input
                  placeholder="Email (optional)"
                  value={formData.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`h-12 rounded-md border-border ${formErrors.email ? "border-destructive" : ""}`}
                  data-testid="input-email"
                />
                {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4">Delivery</h2>
              <div className="space-y-3">
                <div className="h-12 px-3 rounded-md border border-border flex items-center bg-muted/30">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground leading-tight">Country/Region</span>
                    <span className="text-sm font-medium">Pakistan</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className={`h-12 rounded-md border-border ${formErrors.firstName ? "border-destructive" : ""}`}
                      data-testid="input-first-name"
                    />
                    {formErrors.firstName && <p className="text-xs text-destructive mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className={`h-12 rounded-md border-border ${formErrors.lastName ? "border-destructive" : ""}`}
                      data-testid="input-last-name"
                    />
                    {formErrors.lastName && <p className="text-xs text-destructive mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={`h-12 rounded-md border-border ${formErrors.address ? "border-destructive" : ""}`}
                    data-testid="input-address"
                  />
                  {formErrors.address && <p className="text-xs text-destructive mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <Input
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment || ""}
                    onChange={(e) => updateField("apartment", e.target.value)}
                    className="h-12 rounded-md border-border"
                    data-testid="input-apartment"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={`h-12 rounded-md border-border ${formErrors.city ? "border-destructive" : ""}`}
                      data-testid="input-city"
                    />
                    {formErrors.city && <p className="text-xs text-destructive mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Postal code (optional)"
                      value={formData.postalCode || ""}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      className="h-12 rounded-md border-border"
                      data-testid="input-postal-code"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={`h-12 rounded-md border-border ${formErrors.phone ? "border-destructive" : ""}`}
                    data-testid="input-phone"
                  />
                  {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-1">Payment</h2>
              <p className="text-xs text-muted-foreground mb-4">All transactions are secure and encrypted.</p>
              <div className="border border-border rounded-md overflow-hidden">
                <label
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-border ${formData.paymentMethod === "cod" ? "bg-muted/30" : ""}`}
                  data-testid="radio-cod"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() => updateField("paymentMethod", "cod")}
                    className="w-4 h-4 accent-foreground"
                  />
                  <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                </label>

                <label
                  className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer ${formData.paymentMethod === "bank_deposit" ? "bg-muted/30" : ""}`}
                  data-testid="radio-bank-deposit"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_deposit"
                    checked={formData.paymentMethod === "bank_deposit"}
                    onChange={() => updateField("paymentMethod", "bank_deposit")}
                    className="w-4 h-4 accent-foreground mt-0.5"
                  />
                  <span className="text-sm font-medium">Bank Deposit</span>
                </label>

                {formData.paymentMethod === "bank_deposit" && (
                  <div className="px-4 py-4 bg-muted/20 border-t border-border text-sm space-y-3">
                    <div className="space-y-1">
                      <p className="font-semibold">Bank Transfer Details:</p>
                      <p>Bank Name: Faysal Bank</p>
                      <p>IBAN: PK35FAYS0233006000002630</p>
                      <p>Account Number: 0233006000002630</p>
                      <p>Account Title: Candles and Crafts</p>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <p>After making the payment, please share a screenshot of your payment receipt via:</p>
                      <p>WhatsApp: +92 322 4226665</p>
                      <p>Email: info@candlesandcrafts.com</p>
                    </div>
                    <p className="text-muted-foreground italic">
                      We'll process your order as soon as we receive your confirmation. Thank you for shopping with Candles & Crafts!
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <Label htmlFor="notes" className="text-sm text-muted-foreground mb-1.5 block">Order Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions for your order..."
                value={formData.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={2}
                className="rounded-md border-border"
                data-testid="input-notes"
              />
            </section>

            <div className="lg:hidden">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={SHIPPING_COST}
                total={total}
              />
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={createOrder.isPending}
              className="w-full h-14 rounded-none bg-foreground text-background uppercase text-sm tracking-widest font-semibold hover:bg-foreground/90"
              data-testid="button-place-order"
            >
              {createOrder.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {createOrder.isPending ? "Processing..." : "Complete Order"}
            </Button>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={SHIPPING_COST}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ cartItems, subtotal, shipping, total }: {
  cartItems: { productId: number; quantity: number; product: any }[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="space-y-4 bg-muted/20 p-6 rounded-lg border border-border/50">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex gap-3 items-center">
            <div className="relative w-16 h-16 rounded border border-border/50 overflow-hidden flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
              {item.quantity > 1 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.product.category?.replace(/-/g, " ")}</p>
            </div>
            <p className="text-sm font-medium whitespace-nowrap">Rs {(Number(item.product.price) * item.quantity).toLocaleString()}.00</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>Rs {subtotal.toLocaleString()}.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>Rs {shipping.toLocaleString()}.00</span>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-baseline">
        <span className="text-base font-bold">Total</span>
        <div className="text-right">
          <span className="text-xs text-muted-foreground mr-2">PKR</span>
          <span className="text-xl font-bold">Rs {total.toLocaleString()}.00</span>
        </div>
      </div>
    </div>
  );
}
