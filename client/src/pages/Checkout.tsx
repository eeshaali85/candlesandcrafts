import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ShoppingBag,
  CheckCircle,
  Package,
  ArrowLeft,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { checkoutDetailsSchema, type CheckoutDetails } from "@shared/schema";

const SHIPPING_COST = 300;

// ── Policy Modal Content ──────────────────────────────────────────────────────

const POLICIES: Record<string, { title: string; content: React.ReactNode }> = {
  refund: {
    title: "Refund policy",
    content: (
      <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
        <div>
          <p className="font-semibold text-foreground mb-2">
            Returns & Exchanges
          </p>
          <p>
            We prioritize quality, but if you receive a damaged or defective
            product, email{" "}
            <a
              href="mailto:candlesandcraftss@mail.com"
              className="underline text-foreground"
            >
              candlesandcraftss@mail.com
            </a>{" "}
            with details and supporting images/videos. After assessment, we will
            dispatch a replacement to your provided address.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Damaged/Faulty Products
          </p>
          <p>No shipping charges apply to replacements.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Exchanges for Other Reasons
          </p>
          <p>
            The product must be unused, and shipping charges apply for both
            return and new delivery.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Refund Policy</p>
          <p>
            We do not offer refunds. However, if an advance payment has been
            made and we are unable to deliver, a full refund will be processed.
          </p>
        </div>
      </div>
    ),
  },
  shipping: {
    title: "Shipping policy",
    content: (
      <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
        <div>
          <p className="font-semibold text-foreground mb-2">Processing Time</p>
          <p>
            All orders are processed within 2–3 business days. Orders are not
            shipped or delivered on weekends or public holidays.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Delivery Time</p>
          <p>
            Standard delivery across Pakistan takes 7–10 business days after
            dispatch. Remote areas may take slightly longer.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Shipping Charges</p>
          <p>
            A flat shipping fee of Rs 300 applies to all orders nationwide.
            Shipping is free on orders above Rs 5,000.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Order Tracking</p>
          <p>
            Once your order has been dispatched, we will share the tracking
            details via WhatsApp or email so you can follow your package.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Delays</p>
          <p>
            We are not responsible for delays caused by courier companies or
            circumstances beyond our control. We will always do our best to keep
            you informed.
          </p>
        </div>
      </div>
    ),
  },
  privacy: {
    title: "Privacy policy",
    content: (
      <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
        <div>
          <p className="font-semibold text-foreground mb-2">
            Information We Collect
          </p>
          <p>
            When you place an order, we collect your name, email address, phone
            number, and delivery address. This information is used solely to
            fulfill your order and communicate with you about it.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">
            How We Use Your Information
          </p>
          <p>
            Your personal information is used to process and deliver your order,
            send order confirmations and updates, and respond to your inquiries.
            We do not sell, trade, or share your data with third parties.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Data Security</p>
          <p>
            We take reasonable precautions to protect your personal information.
            All transactions are encrypted and your payment details are never
            stored on our servers.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Cookies</p>
          <p>
            Our website may use cookies to improve your browsing experience. You
            can choose to disable cookies through your browser settings.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Contact</p>
          <p>
            If you have any questions about our privacy practices, please reach
            out to us at{" "}
            <a
              href="mailto:candlesandcraftss@mail.com"
              className="underline text-foreground"
            >
              candlesandcraftss@mail.com
            </a>
            .
          </p>
        </div>
      </div>
    ),
  },
  terms: {
    title: "Terms of service",
    content: (
      <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
        <div>
          <p className="font-semibold text-foreground mb-2">General</p>
          <p>
            By placing an order with Candles & Crafts, you agree to these terms
            of service. We reserve the right to update these terms at any time
            without prior notice.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Products</p>
          <p>
            All products are handmade and may have slight variations in color,
            size, or appearance. These are not defects but a natural result of
            the handcrafted process and add to the uniqueness of each item.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Orders</p>
          <p>
            Once an order is placed, it cannot be cancelled or modified. Please
            review your order carefully before completing checkout.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">Pricing</p>
          <p>
            All prices are listed in Pakistani Rupees (PKR). We reserve the
            right to change prices at any time. An 8% tax applies to all Cash on
            Delivery orders.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-2">
            Limitation of Liability
          </p>
          <p>
            Candles & Crafts is not liable for any indirect, incidental, or
            consequential damages arising from the use of our products. Our
            liability is limited to the purchase price of the product in
            question.
          </p>
        </div>
      </div>
    ),
  },
  contact: {
    title: "Contact us",
    content: (
      <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
        <p>
          We'd love to hear from you! Reach out to us through any of the
          channels below and we'll get back to you as soon as possible.
        </p>
        <div className="space-y-3">
          <div className="bg-muted/40 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
              WhatsApp
            </p>
            <a
              href="https://wa.me/923379229966"
              target="_blank"
              rel="noreferrer"
              className="underline text-foreground"
            >
              +92 337 922 9966
            </a>
            <p className="text-xs text-muted-foreground">
              Best for order queries & payment receipts
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
              Email
            </p>
            <a
              href="mailto:candlesandcraftss@mail.com"
              className="underline text-foreground"
            >
              candlesandcraftss@mail.com
            </a>
            <p className="text-xs text-muted-foreground">
              For general inquiries & feedback
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
              Business Hours
            </p>
            <p>Monday – Saturday, 10:00 AM – 8:00 PM PKT</p>
          </div>
        </div>
      </div>
    ),
  },
};

// ── Policy Modal Component ────────────────────────────────────────────────────

function PolicyModal({
  policyKey,
  onClose,
}: {
  policyKey: string;
  onClose: () => void;
}) {
  const policy = POLICIES[policyKey];
  if (!policy) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-bold">{policy.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto">{policy.content}</div>
      </div>
    </div>
  );
}

// ── Policy Footer ─────────────────────────────────────────────────────────────

function PolicyFooter() {
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);

  const links = [
    { key: "refund", label: "Refund policy" },
    { key: "shipping", label: "Shipping" },
    { key: "privacy", label: "Privacy policy" },
    { key: "terms", label: "Terms of service" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <>
      <div className="border-t border-border mt-12 pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => setOpenPolicy(link.key)}
                className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {openPolicy && (
        <PolicyModal
          policyKey={openPolicy}
          onClose={() => setOpenPolicy(null)}
        />
      )}
    </>
  );
}

// ── Main Checkout Page ────────────────────────────────────────────────────────

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
    notes: localStorage.getItem("checkout_special_instructions") || "",
    billingSameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const subtotal =
    cartItems?.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0,
    ) || 0;
  const codTax = formData.paymentMethod === "cod" ? Math.round(subtotal * 0.08) : 0;
  const total = subtotal + SHIPPING_COST + codTax;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-2 text-center max-w-md">
            Thank you, {formData.firstName}! Your order #{confirmedOrder.id} has
            been placed successfully.
          </p>
          <p className="text-muted-foreground mb-8 text-center max-w-md text-sm">
            We'll reach out to you at {formData.phone} to confirm delivery
            details. Please allow 7-10 days for dispatch.
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
              <span className="text-sm">
                {formData.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Bank Deposit"}
              </span>
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
              <p className="font-medium mb-1">
                Please transfer the amount and share receipt via WhatsApp
              </p>
              <p className="text-muted-foreground">+92 3379229966</p>
            </div>
          )}
          <Link href="/shop">
            <Button
              size="lg"
              className="rounded-full px-8"
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
        <PolicyFooter />
      </>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">
            Nothing to check out
          </h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Add some items to your cart first.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="rounded-full px-8"
              data-testid="button-start-shopping"
            >
              Start Shopping
            </Button>
          </Link>
        </div>
        <PolicyFooter />
      </>
    );
  }

  const updateField = (
    field: keyof CheckoutDetails,
    value: string | boolean,
  ) => {
    const parsed =
      field === "billingSameAsShipping"
        ? typeof value === "boolean"
          ? value
          : value === "true"
        : value;
    setFormData({ ...formData, [field]: parsed });
    if (formErrors[field as string]) {
      const newErrors = { ...formErrors };
      delete newErrors[field as string];
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
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to cart
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
            <div className="space-y-8">
              {/* Contact */}
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
                  {formErrors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-lg font-bold mb-4">Delivery</h2>
                <div className="space-y-3">
                  <div className="h-12 px-3 rounded-md border border-border flex items-center bg-muted/30">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        Country/Region
                      </span>
                      <span className="text-sm font-medium">Pakistan</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateField("firstName", e.target.value)
                        }
                        className={`h-12 rounded-md border-border ${formErrors.firstName ? "border-destructive" : ""}`}
                        data-testid="input-first-name"
                      />
                      {formErrors.firstName && (
                        <p className="text-xs text-destructive mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) =>
                          updateField("lastName", e.target.value)
                        }
                        className={`h-12 rounded-md border-border ${formErrors.lastName ? "border-destructive" : ""}`}
                        data-testid="input-last-name"
                      />
                      {formErrors.lastName && (
                        <p className="text-xs text-destructive mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
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
                    {formErrors.address && (
                      <p className="text-xs text-destructive mt-1">
                        {formErrors.address}
                      </p>
                    )}
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
                      {formErrors.city && (
                        <p className="text-xs text-destructive mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Postal code (optional)"
                        value={formData.postalCode || ""}
                        onChange={(e) =>
                          updateField("postalCode", e.target.value)
                        }
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
                    {formErrors.phone && (
                      <p className="text-xs text-destructive mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-lg font-bold mb-1">Payment</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  All transactions are secure and encrypted.
                </p>
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
                    <span className="text-sm font-medium">
                      Cash on Delivery (COD) ("8% Tax will be applicable on COD
                      orders")
                    </span>
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
                      onChange={() =>
                        updateField("paymentMethod", "bank_deposit")
                      }
                      className="w-4 h-4 accent-foreground mt-0.5"
                    />
                    <span className="text-sm font-medium">Bank Deposit</span>
                  </label>

                  {formData.paymentMethod === "bank_deposit" && (
                    <div className="px-4 py-4 bg-muted/20 border-t border-border text-sm space-y-3">
                      <div className="space-y-1">
                        <p className="font-semibold">Faysal Bank:</p>
                        <p>IBAN: PK80FAYS3565383000002240</p>
                        <p>Account Number: 3565383000002240</p>
                        <p>Account Title: Eesha Ali</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">NayaPay:</p>
                        <p>Account: 03379229966</p>
                        <p>Account Title: Eesha Ali</p>
                      </div>
                      <div className="space-y-1 text-muted-foreground">
                        <p>
                          After making the payment, please share a screenshot of
                          your payment receipt via:
                        </p>
                        <p>WhatsApp: +92 3379229966</p>
                        <p>Email: candlesandcraftss@mail.com</p>
                      </div>
                      <p className="text-muted-foreground italic">
                        We'll process your order as soon as we receive your
                        confirmation. Thank you for shopping with Candles &
                        Crafts!
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Order Notes */}
              <section>
                <Label
                  htmlFor="notes"
                  className="text-sm text-muted-foreground mb-1.5 block"
                >
                  Order Notes (optional)
                </Label>
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

              {/* Billing Address */}
              <section>
                <h2 className="text-lg font-bold mb-4">Billing address</h2>
                <div className="border border-border rounded-md overflow-hidden">
                  <label
                    className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-border ${
                      formData.billingSameAsShipping ? "bg-muted/30" : ""
                    }`}
                    data-testid="radio-billing-same"
                  >
                    <input
                      type="radio"
                      name="billingAddress"
                      checked={formData.billingSameAsShipping === true}
                      onChange={() =>
                        updateField("billingSameAsShipping", true)
                      }
                      className="w-4 h-4 accent-foreground"
                    />
                    <span className="text-sm font-medium">
                      Same as shipping address
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer ${
                      !formData.billingSameAsShipping ? "bg-muted/30" : ""
                    }`}
                    data-testid="radio-billing-different"
                  >
                    <input
                      type="radio"
                      name="billingAddress"
                      checked={formData.billingSameAsShipping === false}
                      onChange={() =>
                        updateField("billingSameAsShipping", false)
                      }
                      className="w-4 h-4 accent-foreground"
                    />
                    <span className="text-sm font-medium">
                      Use a different billing address
                    </span>
                  </label>

                  {!formData.billingSameAsShipping && (
                    <div className="px-4 py-4 border-t border-border space-y-3">
                      <div>
                        <Input
                          placeholder="Address"
                          value={formData.billingAddress || ""}
                          onChange={(e) =>
                            updateField("billingAddress", e.target.value)
                          }
                          className={`h-12 rounded-md border-border ${
                            formErrors.billingAddress
                              ? "border-destructive"
                              : ""
                          }`}
                          data-testid="input-billing-address"
                        />
                        {formErrors.billingAddress && (
                          <p className="text-xs text-destructive mt-1">
                            {formErrors.billingAddress}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            placeholder="City"
                            value={formData.billingCity || ""}
                            onChange={(e) =>
                              updateField("billingCity", e.target.value)
                            }
                            className={`h-12 rounded-md border-border ${
                              formErrors.billingCity ? "border-destructive" : ""
                            }`}
                            data-testid="input-billing-city"
                          />
                          {formErrors.billingCity && (
                            <p className="text-xs text-destructive mt-1">
                              {formErrors.billingCity}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Postal code (optional)"
                            value={formData.billingPostalCode || ""}
                            onChange={(e) =>
                              updateField("billingPostalCode", e.target.value)
                            }
                            className="h-12 rounded-md border-border"
                            data-testid="input-billing-postal-code"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Mobile Order Summary */}
              <div className="lg:hidden">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shipping={SHIPPING_COST}
                  tax={codTax}
                  total={total}
                />
              </div>

              {/* Place Order Button */}
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

            {/* Desktop Order Summary */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shipping={SHIPPING_COST}
                  tax={codTax}
                  total={total}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Footer with modals */}
      <PolicyFooter />
    </>
  );
}

// ── Order Summary ─────────────────────────────────────────────────────────────

function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
}: {
  cartItems: { productId: number; quantity: number; product: any }[];
  subtotal: number;
  shipping: number;
  tax: number;
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
              <p className="text-sm font-medium truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {item.product.category?.replace(/-/g, " ")}
              </p>
            </div>
            <p className="text-sm font-medium whitespace-nowrap">
              Rs {(Number(item.product.price) * item.quantity).toLocaleString()}
              .00
            </p>
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
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">COD Tax (8%)</span>
            <span>Rs {tax.toLocaleString()}.00</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-baseline">
        <span className="text-base font-bold">Total</span>
        <div className="text-right">
          <span className="text-xs text-muted-foreground mr-2">PKR</span>
          <span className="text-xl font-bold">
            Rs {total.toLocaleString()}.00
          </span>
        </div>
      </div>
    </div>
  );
}
