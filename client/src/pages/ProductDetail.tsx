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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, candleSlug]);

  // ── Pillar candle products with individual pricing ────────────────────────
  const pillarCandles: Record<
    string,
    { displayName: string; scented: number; unscented: number; weight?: string }
  > = {
    "sakura-candle":         { displayName: "Sakura Candle",                  scented: 1000, unscented: 850,  weight: "90g"  },
    "body-candle":           { displayName: "Body Candle",                     scented: 1000, unscented: 850,  weight: "90g"  },
    "knot-candle":           { displayName: "Knot Candle",                     scented: 1000, unscented: 850,  weight: "90g"  },
    "short-ribbed-pierre":   { displayName: "Ribbed Pierre Candle 300ml",      scented: 1800, unscented: 1300, weight: "300g" },
    "long-ribbed-pierre":    { displayName: "Ribbed Pierre Candle 600ml",      scented: 2700, unscented: 1700, weight: "600g" },
    "cylinder-ribbed-thin":  { displayName: "Cylinder Ribbed Candle (Thin)",   scented: 1100, unscented: 900,  weight: "135g" },
    "cylinder-ribbed-thick": { displayName: "Cylinder Ribbed Candle (Thick)",  scented: 1800, unscented: 1300, weight: "315g" },
    "mini-bubble-candle":    { displayName: "Mini Bubble Candle",              scented: 600,  unscented: 550  },
    "rose-heart-candle":     { displayName: "Rose Heart Candle",               scented: 700,  unscented: 650  },
    "cloud-candle":          { displayName: "Cloud Candle",                    scented: 600,  unscented: 550  },
    "arch-candle":           { displayName: "Arch Candle",                     scented: 1450, unscented: 1100, weight: "230g" },
    "heart-bubble-candle":   { displayName: "Heart Bubble Candle",             scented: 1250, unscented: 1000 },
    "bubble-candle":         { displayName: "Bubble Candle",                   scented: 1250, unscented: 1000 },
    "seashell-candle":       { displayName: "Seashell Candle",                 scented: 1250, unscented: 1000 },
    "puffy-candle":          { displayName: "Puffy Candle",                    scented: 1250, unscented: 1000 },
    "rose-bear-candle":      { displayName: "Rose Bear Candle",                scented: 1250, unscented: 1000 },
    "dog-candle":            { displayName: "Dog Candle",                      scented: 1250, unscented: 1000 },
    "twisted-candle":        { displayName: "Twisted Candle",                  scented: 850,  unscented: 750  },
    "spiral-candle":         { displayName: "Spiral Candle",                   scented: 850,  unscented: 750  },
    "mini-seashell-candle":  { displayName: "Mini Seashell Candle",            scented: 600,  unscented: 550  },
    "small-peony-candle":    { displayName: "Small Peony Candle",              scented: 750,  unscented: 700  },
    "rose-bud-candle":       { displayName: "Rose Bud Candle",                 scented: 850,  unscented: 750  },
    "mini-bear-candle":      { displayName: "Mini Bear Candle",                scented: 375,  unscented: 350  },
    "daisy-candle":          { displayName: "Daisy Candle",                    scented: 375,  unscented: 350  },
    "peony-bud-candle":      { displayName: "Peony Bud Candle",                scented: 400,  unscented: 350  },
    "tulip-candle":          { displayName: "Tulip Candle",                    scented: 375,  unscented: 350  },
    "peony-candle":          { displayName: "Peony Candle",                    scented: 900,  unscented: 800, weight: "70g" },
    "sun-moon-candle":       { displayName: "Sun & Moon Candle",               scented: 850,  unscented: 750  },
    "aromatic-rose-candle":  { displayName: "Aromatic Rose Candle",            scented: 900,  unscented: 800  },
    "tapered-candle":        { displayName: "Tapered Candle",                  scented: 850,  unscented: 750  },
    "big-bear-candle":       { displayName: "Big Bear Candle",                 scented: 850,  unscented: 750  },
    "rose-candle":           { displayName: "Rose Candle",                     scented: 900,  unscented: 800  },
    "3d-heart-candle":       { displayName: "3D Heart Candle",                 scented: 900,  unscented: 800, weight: "80g" },
    "butterfly-candle":      { displayName: "Butterfly Candle",                scented: 600,  unscented: 525 },
  };

  // Static candle from slug route
  const staticCandle = candleSlug ? (pillarCandles[candleSlug] ?? null) : null;

  // ── Jar candle series ─────────────────────────────────────────────────────
  const jarSeries: Record<string, { displayName: string; subtitle: string; price: number; weight: string }> = {
    "mini-moments":    { displayName: "Mini Moments Series",   subtitle: "Shot Glass Candle", price: 800,  weight: "60g"  },
    "aurora":          { displayName: "Aurora Series",         subtitle: "Mini Gold Candle",  price: 1700, weight: "100g" },
    "eclipse":         { displayName: "Eclipse Series",        subtitle: "Black Jar Candle",  price: 2300, weight: "—"   },
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
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/shop?category=decorative-candles">
            <Button variant="ghost" className="mb-6 hover:bg-transparent p-0 flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Button>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Placeholder image */}
            <div className="aspect-square bg-secondary/30 rounded-2xl flex items-center justify-center">
              <span className="text-muted-foreground text-sm">coming soon</span>
            </div>
            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-primary">{staticCandle.displayName}</h1>
                {staticCandle.weight && <p className="text-muted-foreground text-sm mt-1">{staticCandle.weight}</p>}
              </div>
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
              <Button disabled className="w-full py-4 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm">
                coming soon — contact us to order
              </Button>
              <p className="text-sm text-muted-foreground">
                To order, please contact us via{" "}
                <a href="https://wa.me/923379229966" target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>.
              </p>
            </div>
          </div>
        </div>
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
        <Link href="/shop">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-transparent p-0 flex items-center gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
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

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="w-full py-4 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm"
              data-testid="button-add-to-cart"
            >
              {addToCart.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add to cart
            </Button>

            {/* Description */}
            <div className="space-y-4 text-muted-foreground pt-4">
              <p>{product.description}</p>
              <p>
                Expertly hand-poured with care, this charming candle combines luxury with love.
                Whether you're planning a romantic evening or gifting your BFF, this candle brings
                warmth, fragrance, and smiles in equal measure.
              </p>
            </div>
          </div>
        </div>

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