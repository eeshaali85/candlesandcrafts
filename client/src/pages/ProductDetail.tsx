import { useRoute } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PILLAR_CANDLES } from "./Shop";

export default function ProductDetail() {
  const [, idParams] = useRoute("/product/:id");
  const [, slugParams] = useRoute("/product/candle/:slug");

  // Slug-based route (decorative/static candles)
  const candleSlug = slugParams?.slug ?? null;
  // ID-based route (jar candles from DB)
  const id = idParams && !candleSlug ? parseInt(idParams.id) : 0;

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: allProducts } = useProducts();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedScent, setSelectedScent] = useState("flower meadows");
  const [selectedScented, setSelectedScented] = useState<"scented" | "unscented">("scented");
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "how-to-use" | "shipping">("details");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, candleSlug]);

  // ── Pillar candle products — built from PILLAR_CANDLES (single source of truth) ──
  const pillarCandles = Object.fromEntries(
    PILLAR_CANDLES.map((c) => [
      c.key,
      { displayName: c.displayName, scented: c.scented, unscented: c.unscented, weight: c.weight },
    ])
  );

  // ── Short descriptions shown in the right product panel ───────────────────
  const pillarDescriptions: Record<string, string> = {
    "bubble-candle":         "A chunky, sculptural candle with a satisfying clustered bubble texture. Looks stunning on shelves and coffee tables, and makes for a thoughtful gift.",
    "seashell-candle":       "Inspired by the ocean floor, this delicately detailed seashell candle brings coastal serenity into your space. Beautiful both lit and unlit.",
    "heart-bubble-candle":   "Soft, romantic, and endlessly charming — this heart-shaped bubble candle is a perfect gift for someone you love.",
    "rose-bear-candle":      "A sweet floral bear crafted in wax. Playful, decorative, and utterly giftable — especially for birthdays and Valentine's Day.",
    "puffy-candle":          "Pillowy and plush in form, this candle adds a soft, modern aesthetic to any surface. A minimalist favourite.",
    "dog-candle":            "For the dog lover in your life — this adorable handcrafted pup candle is as charming as it is fragrant.",
    "cylinder-ribbed-thin":  "Sleek ribbed texture meets a slim silhouette. This tall cylinder candle adds height and sophistication to any arrangement.",
    "sakura-candle":         "Delicate cherry blossom-inspired form with a soft, feminine silhouette. A beautiful seasonal decor piece.",
    "body-candle":           "A graceful, abstract body-form candle — modern art meets candlelight. Striking as a centrepiece or gift.",
    "knot-candle":           "Sculptural and architectural, the knot candle is a statement piece that looks like it belongs in a design gallery.",
    "moon-candle":           "A crescent moon in wax — peaceful, mystical, and perfect for a calming bedside or shelf display.",
    "serra-ribbed-candle":   "A compact ribbed pillar candle with a premium look. The subtle texture catches and scatters light beautifully.",
    "3d-heart-candle":       "A dimensional heart candle with depth and personality. The ideal romantic gift or self-love treat.",
    "peony-candle":          "Full-bloom peony sculpted in wax — lush, layered, and breathtakingly realistic. A floral lover's dream.",
    "sun-moon-candle":       "Celestial duality in one candle — a sun on one side, a moon on the other. Perfect for the cosmic soul.",
    "rose-candle":           "A timeless rose blossom rendered in smooth wax. Classic, romantic, and always in style.",
    "tapered-candle":        "Slim and elegant, this tapered candle adds a classic candlelight feel to dinner tables and mantelpieces.",
    "big-bear-candle":       "A cuddly bear candle that makes an instant mood-lifter. Adorable for nurseries, gifts, and shelfies.",
    "rose-bud-candle":       "A tight, delicate rosebud captured in wax — petite, pretty, and perfect as a standalone accent or gift add-on.",
    "cloud-candle":          "Fluffy cloud form in smooth wax. Dreamy and whimsical, this candle brings softness to any corner.",
    "twisted-candle":        "Bold twist form with a modern, artistic feel. Inspired by contemporary sculpture — a statement on any surface.",
    "spiral-candle":         "A continuous spiral form that plays with light and shadow as it burns. Elegant and architectural.",
    "butterfly-candle":      "Delicate and dreamy, the Butterfly Candle flutters into any space with its sculpted wings and soft pastel hues.",
    "mini-seashell-candle":  "A miniature seashell candle — sweet, detailed, and perfect as a standalone accent or in a set.",
    "mini-bubble-candle":    "Tiny clustered bubbles in a compact form. Cute, contemporary, and perfect for gifting or decorating small spaces.",
    "rose-heart-candle":     "A romantic fusion of rose petals and heart shape — a dreamy gift for any occasion.",
    "small-peony-candle":    "A petite peony in full bloom. All the beauty of our full-sized Peony Candle in a compact, giftable size.",
    "eid-candle":            "Crafted to mark special moments during Eid — a meaningful, fragrant gift that adds warmth and celebration to the occasion.",
    "cat-paw-candle":        "An irresistibly cute cat paw candle. Perfect for cat lovers, gift hampers, and desk decor.",
    "arch-candle":           "A bold architectural arch form — dramatic, statement-making, and unlike any candle you've seen.",
    "ribbed-pierre-300ml":   "A short, wide ribbed pillar candle with a luxurious feel. The ribbed texture creates beautiful light play as it burns.",
    "cylinder-ribbed-thick": "A substantial thick cylinder with a satisfying ribbed texture. Makes a grand centrepiece on dining tables or sideboards.",
    "ribbed-pierre-600ml":   "Our grandest pillar candle — a tall ribbed column that burns for hours and commands any room with quiet luxury.",
    "daisy-candle":          "A tiny daisy in wax — cheerful, sweet, and perfect as a gift tag candle or tray accent.",
    "peony-bud-candle":      "A peony bud mid-bloom, captured in miniature. Delicate and beautiful for gifting and styling.",
    "tulip-candle":          "A slender tulip candle for bringing a touch of spring indoors. Charming as a single piece or in a group.",
    "mini-bear-candle":      "The tiniest bear candle in our collection — adorably small, surprisingly detailed, and perfect as a gift add-on.",
    "macaroon-candle":       "Inspired by the French macaron — pastel, sweet, and impossibly cute. A dessert-lover's favourite candle.",
  };

  // Static candle from slug route
  const staticCandle = candleSlug ? (pillarCandles[candleSlug] ?? null) : null;

  // ── Jar candle series ─────────────────────────────────────────────────────
  const jarSeries: Record<string, { displayName: string; subtitle: string; price: number; weight: string }> = {
    "mini-moments":    { displayName: "Mini Moments Series",   subtitle: "Shot Glass Candle", price: 800,  weight: "60g"  },
    "aurora":          { displayName: "Aurora Series",         subtitle: "Mini Gold Candle",  price: 1700, weight: "100g" },
    "eclipse":         { displayName: "Eclipse Series",        subtitle: "Black Jar Candle",  price: 2200, weight: "—"   },
    "amber":           { displayName: "Amber Series",          subtitle: "Amber Jar Candle",  price: 2700, weight: "240g" },
    "signature-luxe":  { displayName: "Signature Luxe Series", subtitle: "Lidded Candle",     price: 3200, weight: "300g" },
  };

  // ── Scents with correct notes from scent list ─────────────────────────────
  const scents = [
    "flower meadows",
    "butterscotch",
    "pink chiffon",
    "alexandria library",
    "oudh e bakhoor",
    "ocean breeze",
    "serenity",
  ];

  const scentDescriptions: Record<string, { notes: string; description: string }> = {
    "flower meadows": {
      notes: "Honeysuckle, Jasmine",
      description: "A delicate bouquet of wildflowers dancing in a sunlit meadow. Fresh and romantic.",
    },
    "butterscotch": {
      notes: "Toasted Vanilla, Sandalwood",
      description: "Warm and indulgent with creamy toasted vanilla swirled into rich sandalwood. Comforting and sweet.",
    },
    "pink chiffon": {
      notes: "Sparkling Pear, Vanilla",
      description: "Light and airy like delicate fabric, with sparkling pear and a whisper of warm vanilla.",
    },
    "alexandria library": {
      notes: "Orange Blossom, Leather",
      description: "The scent of ancient wisdom — bright orange blossom softened by rich, worn leather.",
    },
    "oudh e bakhoor": {
      notes: "Agarwood, Violet Leaves",
      description: "An opulent Middle Eastern blend of precious agarwood and delicate violet leaves.",
    },
    "ocean breeze": {
      notes: "Citrus, Bergamot, Sea Salt",
      description: "A refreshing coastal escape with zesty citrus, aromatic bergamot, and crisp sea salt.",
    },
    "serenity": {
      notes: "Lavender, Balsam Trees",
      description: "A calming sanctuary of soft lavender and grounding balsam trees.",
    },
  };

  // ── Per-product descriptions & details ────────────────────────────────────
  const productInfo: Record<string, { story: string; details: { label: string; value: string }[] }> = {
    "butterfly-candle": {
      story: "Delicate and dreamy, the Butterfly Candle flutters into any space with its sculpted wings and soft pastel hues. Whether placed on a vanity, shelf, or gifted to someone special, this candle brings a whimsical touch to everyday moments.",
      details: [
        { label: "Dimensions", value: "—" },
        { label: "Net Weight", value: "—" },
        { label: "Burn Time", value: "—" },
      ],
    },
    "mini-moments": {
      story: "Big fragrance in a tiny vessel — the Mini Moments Series is perfect for gifting or filling small spaces with warm, lasting scent. Hand-poured into a charming shot glass jar, each candle is a pocket-sized luxury.",
      details: [
        { label: "Container", value: "Shot Glass Jar" },
        { label: "Net Weight", value: "60g" },
        { label: "Burn Time", value: "~10–12 hours" },
      ],
    },
    "aurora": {
      story: "The Aurora Series radiates gentle warmth with its elegant mini gold jar. Inspired by the soft glow of the northern lights, each candle is a luminous centrepiece for your home.",
      details: [
        { label: "Container", value: "Mini Gold Jar" },
        { label: "Net Weight", value: "100g" },
        { label: "Burn Time", value: "~20–25 hours" },
      ],
    },
    "eclipse": {
      story: "Bold, mysterious, and utterly captivating — the Eclipse Series is for those who embrace the dark side of luxury. Encased in a sleek black jar, this candle commands every corner of the room.",
      details: [
        { label: "Container", value: "Black Jar" },
        { label: "Net Weight", value: "—" },
        { label: "Burn Time", value: "—" },
      ],
    },
    "amber": {
      story: "Warm and inviting, the Amber Series captures the rich glow of golden hour in every burn. The amber-toned jar adds an earthy elegance to any shelf, desk, or bedside table.",
      details: [
        { label: "Container", value: "Amber Jar" },
        { label: "Net Weight", value: "240g" },
        { label: "Burn Time", value: "~45–50 hours" },
      ],
    },
    "signature-luxe": {
      story: "Our most indulgent creation — the Signature Luxe Series is crafted for those who refuse to compromise. Housed in a lidded vessel, this candle is as stunning unlit as it is burning.",
      details: [
        { label: "Container", value: "Lidded Jar" },
        { label: "Net Weight", value: "300g" },
        { label: "Burn Time", value: "~55–60 hours" },
      ],
    },
  };

  // ── How to use & shipping content (shared) ────────────────────────────────
  const howToUse = [
    "Trim the wick to 5mm before each burn.",
    "On the first burn, allow the wax to melt all the way to the edges of the container.",
    "Never burn for more than 4 hours at a time.",
    "Keep away from drafts, children, and pets.",
    "Never leave a burning candle unattended.",
    "Stop use when only 1cm of wax remains.",
  ];

  // ── Color options for pillar candles ──────────────────────────────────────
  const pillarColors = [
    { value: "blue",   label: "Blue"   },
    { value: "pink",   label: "Pink"   },
    { value: "green",  label: "Green"  },
    { value: "purple", label: "Purple" },
    { value: "grey",   label: "Grey"   },
    { value: "white",  label: "White"  },
    { value: "yellow", label: "Yellow" },
    { value: "red",    label: "Red"    },
    { value: "orange", label: "Orange" },
    { value: "brown",  label: "Brown"  },
  ];

  const slug = product?.slug ?? "";
  const isJarCandle = product?.category?.toLowerCase().includes("jar");
  const isDecorativeCandle =
    product?.category?.toLowerCase().includes("decorative") ||
    product?.category?.toLowerCase().includes("pillar");

  const jarSeriesKey = Object.keys(jarSeries).find(
    (k) =>
      slug.includes(k) ||
      product?.name?.toLowerCase().includes(jarSeries[k].displayName.toLowerCase().split(" ")[0]),
  );
  const matchedJarSeries = jarSeriesKey ? jarSeries[jarSeriesKey] : null;

  const pillarKey = Object.keys(pillarCandles).find(
    (k) =>
      slug.includes(k) ||
      product?.name?.toLowerCase().replace(/\s+/g, "-").includes(k),
  );
  const matchedPillar = pillarKey ? pillarCandles[pillarKey] : null;

  const basePrice = matchedJarSeries
    ? matchedJarSeries.price
    : matchedPillar
    ? matchedPillar[selectedScented]
    : Number(product?.price ?? 0);

  // For slug-based static candle routes — no DB fetch needed
  if (staticCandle) {
    const basePrice = staticCandle[selectedScented];
    const candleDescription = candleSlug ? pillarDescriptions[candleSlug] : undefined;
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 hover:bg-transparent p-0 flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Sticky image */}
            <div className="lg:sticky lg:top-24 space-y-3">
              <div className="aspect-square bg-secondary/30 rounded-2xl flex items-center justify-center">
                <span className="text-muted-foreground text-sm">coming soon</span>
              </div>
            </div>
            {/* Scrollable Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-primary">{staticCandle.displayName}</h1>
                {staticCandle.weight && <p className="text-muted-foreground text-sm mt-1">{staticCandle.weight}</p>}
              </div>
              {candleDescription && (
                <p className="text-muted-foreground leading-relaxed text-sm">{candleDescription}</p>
              )}
              <div>
                <p className="text-lg text-[#c45e4c] font-semibold">Rs.{basePrice.toLocaleString()}.00</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scented: Rs.{staticCandle.scented.toLocaleString()} &nbsp;·&nbsp; Unscented: Rs.{staticCandle.unscented.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
                </p>
              </div>
              {/* Scented/Unscented */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">scented or unscented</p>
                <Select value={selectedScented} onValueChange={(val) => setSelectedScented(val as "scented" | "unscented")}>
                  <SelectTrigger className="w-full bg-muted border-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scented">Scented — Rs.{staticCandle.scented.toLocaleString()}</SelectItem>
                    <SelectItem value="unscented">Unscented — Rs.{staticCandle.unscented.toLocaleString()}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Color */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">color</p>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full bg-muted border-0"><SelectValue /></SelectTrigger>
                  <SelectContent side="bottom">
                    {pillarColors.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Scent (when scented) */}
              {selectedScented === "scented" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">scent</p>
                  <Select value={selectedScent} onValueChange={setSelectedScent}>
                    <SelectTrigger className="w-full bg-muted border-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {scents.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {scentDescriptions[selectedScent] && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium text-primary">Notes: {scentDescriptions[selectedScent].notes}</p>
                      <p className="text-sm text-muted-foreground mt-1">{scentDescriptions[selectedScent].description}</p>
                    </div>
                  )}
                </div>
              )}
              {/* Quantity */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Quantity</p>
                <div className="flex items-center border border-muted-foreground/20 rounded-sm bg-muted w-fit">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="px-3 py-2 hover:bg-muted/50 transition-colors text-muted-foreground"><Minus className="w-3 h-3" /></button>
                  <span className="w-8 text-center text-sm text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 hover:bg-muted/50 transition-colors text-muted-foreground"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
              {/* Gift Packaging */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={giftPackaging}
                  onChange={(e) => setGiftPackaging(e.target.checked)}
                  className="w-4 h-4 accent-foreground"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Gift Packaging</p>
                  <p className="text-xs text-muted-foreground">Beautifully wrapped for gifting</p>
                </div>
                <span className="text-sm font-semibold text-[#c45e4c]">+Rs. 150</span>
              </label>
              {giftPackaging && (
                <p className="text-sm text-[#c45e4c] font-medium">
                  Total: Rs.{(basePrice * quantity + 150).toLocaleString()}.00
                  <span className="text-xs text-muted-foreground font-normal ml-1">(incl. gift packaging)</span>
                </p>
              )}
              {/* Special Instructions */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Special Instructions <span className="text-xs">(optional)</span></p>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. specific shade of color, personalised message, packaging preference..."
                  rows={3}
                  className="w-full rounded-md bg-muted border-0 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-border"
                />
              </div>

              <a
                href={`https://wa.me/923379229966?text=${encodeURIComponent(
                  `Hi! I'd like to order:\n\n*${staticCandle.displayName}*\nScented/Unscented: ${selectedScented}\nColor: ${selectedColor}${selectedScented === "scented" ? `\nScent: ${selectedScent}` : ""}\nQuantity: ${quantity}${giftPackaging ? "\nGift Packaging: Yes (+Rs. 150)" : ""}${specialInstructions ? `\nSpecial Instructions: ${specialInstructions}` : ""}\n\nTotal (excl. shipping): Rs.${(basePrice * quantity + (giftPackaging ? 150 : 0)).toLocaleString()}.00`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <Button className="w-full py-4 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-sm">
                  Order via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* ── Product Info Tabs ─────────────────────────────────────────── */}
        {(() => {
          const info = productInfo[candleSlug ?? ""];
          return (
            <div className="mt-14 border-t border-border/40 pt-10">
              <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {(["details", "how-to-use", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                      activeTab === tab
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
                    }`}
                  >
                    {tab === "details" ? "Product Details" : tab === "how-to-use" ? "How to Use" : "Shipping & Return"}
                  </button>
                ))}
              </div>

              {activeTab === "details" && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {info?.story && <p className="text-muted-foreground leading-relaxed">{info.story}</p>}
                  {info?.details && info.details.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {info.details.map((d) => (
                        <div key={d.label} className="bg-muted/40 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">{d.label}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5">{d.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {!info && <p className="text-muted-foreground text-sm">Product details coming soon.</p>}
                </div>
              )}

              {activeTab === "how-to-use" && (
                <ul className="space-y-3 max-w-xl mx-auto">
                  {howToUse.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
                  <p><span className="font-medium text-foreground">Delivery Timeline:</span> 7–15 working days. Urgent delivery can be arranged — contact us on Instagram.</p>
                  <p><span className="font-medium text-foreground">Shipping Charges:</span> Flat Rs. 300 across Pakistan.</p>
                  <p><span className="font-medium text-foreground">Returns & Exchanges:</span> We prioritize quality. If you receive a damaged or defective product, email <a href="mailto:candlesandcraftss@mail.com" className="underline text-foreground">candlesandcraftss@mail.com</a> with photos. Replacements are dispatched at no extra shipping cost.</p>
                  <p><span className="font-medium text-foreground">Exchanges for Other Reasons:</span> Item must be unused. Shipping charges apply for return and new delivery.</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-serif text-destructive">Product Not Found</h2>
        <Link href="/shop">
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id, quantity });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 hover:bg-transparent p-0 flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Product Images — sticky on desktop */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border-2 border-muted-foreground/20">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-muted-foreground/10">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-70 rounded-lg" />
              </div>
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-muted-foreground/10">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-70 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary">
                {matchedJarSeries
                  ? matchedJarSeries.displayName
                  : matchedPillar
                  ? matchedPillar.displayName
                  : product.name}
              </h1>
              {matchedJarSeries && (
                <p className="text-muted-foreground text-sm mt-1">
                  {matchedJarSeries.subtitle} · {matchedJarSeries.weight}
                </p>
              )}
              {matchedPillar?.weight && (
                <p className="text-muted-foreground text-sm mt-1">{matchedPillar.weight}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <p className="text-lg text-[#c45e4c] font-semibold">
                Rs.{basePrice.toLocaleString()}.00
              </p>
              {matchedPillar && (
                <p className="text-xs text-muted-foreground mt-1">
                  Scented: Rs.{matchedPillar.scented.toLocaleString()} &nbsp;·&nbsp; Unscented: Rs.{matchedPillar.unscented.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
              </p>
            </div>

            {/* ── Scented / Unscented dropdown — pillar candles only ── */}
            {isDecorativeCandle && matchedPillar && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">scented or unscented</p>
                <Select
                  value={selectedScented}
                  onValueChange={(val) => setSelectedScented(val as "scented" | "unscented")}
                >
                  <SelectTrigger className="w-full bg-muted border-0" data-testid="select-scented">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scented">
                      Scented — Rs.{matchedPillar.scented.toLocaleString()}
                    </SelectItem>
                    <SelectItem value="unscented">
                      Unscented — Rs.{matchedPillar.unscented.toLocaleString()}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ── Color dropdown — pillar candles ── */}
            {isDecorativeCandle && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">color</p>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full bg-muted border-0" data-testid="select-color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {pillarColors.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ── Scent dropdown — jar candles always, pillar candles when scented ── */}
            {(isJarCandle || (isDecorativeCandle && selectedScented === "scented")) && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">scent</p>
                <Select value={selectedScent} onValueChange={setSelectedScent}>
                  <SelectTrigger className="w-full bg-muted border-0" data-testid="select-scent">
                    <SelectValue placeholder="Select scent" />
                  </SelectTrigger>
                  <SelectContent>
                    {scents.map((scent) => (
                      <SelectItem key={scent} value={scent}>
                        {scent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Scent notes card */}
                {selectedScent && scentDescriptions[selectedScent] && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium text-primary">
                      Notes: {scentDescriptions[selectedScent].notes}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {scentDescriptions[selectedScent].description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Quantity</p>
              <div className="flex items-center border border-muted-foreground/20 rounded-sm bg-muted w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-muted/50 transition-colors text-muted-foreground"
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-muted/50 transition-colors text-muted-foreground"
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Special Instructions <span className="text-xs">(optional)</span></p>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. personalised message, gifting note, packaging preference..."
                rows={3}
                className="w-full rounded-md bg-muted border-0 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-border"
              />
            </div>

            {/* Add to Cart */}
            <Button
              onClick={() => {
                if (specialInstructions.trim()) {
                  localStorage.setItem("checkout_special_instructions", specialInstructions.trim());
                } else {
                  localStorage.removeItem("checkout_special_instructions");
                }
                handleAddToCart();
              }}
              disabled={addToCart.isPending}
              className="w-full py-4 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm"
              data-testid="button-add-to-cart"
            >
              {addToCart.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add to cart
            </Button>
          </div>
        </div>

        {/* ── Product Info Tabs ──────────────────────────────────────────── */}
        {(() => {
          const infoKey = matchedJarSeries
            ? Object.keys(productInfo).find((k) =>
                product?.name?.toLowerCase().includes(k.replace(/-/g, " ").split(" ")[0])
              )
            : matchedPillar
            ? slug
            : null;
          const info = infoKey ? productInfo[infoKey] : null;
          return (
            <div className="mt-14 border-t border-border/40 pt-10">
              <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {(["details", "how-to-use", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                      activeTab === tab
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
                    }`}
                  >
                    {tab === "details" ? "Product Details" : tab === "how-to-use" ? "How to Use" : "Shipping & Return"}
                  </button>
                ))}
              </div>

              {activeTab === "details" && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {(info?.story || product.description) && (
                    <p className="text-muted-foreground leading-relaxed">{info?.story || product.description}</p>
                  )}
                  {info?.details && info.details.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {info.details.map((d) => (
                        <div key={d.label} className="bg-muted/40 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">{d.label}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5">{d.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {!info && <p className="text-muted-foreground text-sm">Product details coming soon.</p>}
                </div>
              )}

              {activeTab === "how-to-use" && (
                <ul className="space-y-3 max-w-xl mx-auto">
                  {howToUse.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
                  <p><span className="font-medium text-foreground">Delivery Timeline:</span> 7–15 working days. Urgent delivery can be arranged — contact us on Instagram.</p>
                  <p><span className="font-medium text-foreground">Shipping Charges:</span> Flat Rs. 300 across Pakistan.</p>
                  <p><span className="font-medium text-foreground">COD Tax:</span> An 8% tax applies to all Cash on Delivery orders.</p>
                  <p><span className="font-medium text-foreground">Returns & Exchanges:</span> We prioritize quality. If you receive a damaged or defective product, email <a href="mailto:candlesandcraftss@mail.com" className="underline text-foreground">candlesandcraftss@mail.com</a> with photos. Replacements are dispatched at no extra shipping cost.</p>
                  <p><span className="font-medium text-foreground">Exchanges for Other Reasons:</span> Item must be unused. Shipping charges apply for return and new delivery.</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-serif text-primary italic mb-8 text-center">
            more cute stuff for your liking
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allProducts &&
              allProducts
                .filter((p: any) => p.id !== id)
                .slice(0, 4)
                .map((relatedProduct: any) => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-square overflow-hidden bg-white rounded-lg mb-3">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
                        />
                      </div>
                      <h3 className="text-sm text-center text-primary font-medium mb-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-center text-[#c45e4c] font-semibold">
                        Rs.{parseFloat(relatedProduct.price).toLocaleString()}.00
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 mb-12">
          <h2 className="text-2xl font-serif text-primary text-center mb-8">Customer Reviews</h2>
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              No reviews yet. Be the first to share your thoughts!
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8"
              data-testid="button-write-review"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}