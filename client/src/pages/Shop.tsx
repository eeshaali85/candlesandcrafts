import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Grid3x3, List } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-low",    label: "Price: Low to High" },
  { value: "price-high",   label: "Price: High to Low" },
  { value: "newest",       label: "Newest" },
];

// ── Jar candle series ─────────────────────────────────────────────────────────
export const JAR_CANDLE_SERIES = [
  { key: "mini-moments",   displayName: "Mini Moments Series",   subtitle: "Shot Glass Candle", price: 800,  weight: "60g"  },
  { key: "aurora",         displayName: "Aurora Series",         subtitle: "Mini Gold Candle",  price: 1700, weight: "100g" },
  { key: "eclipse",        displayName: "Eclipse Series",        subtitle: "Black Jar Candle",  price: 2300, weight: "—"   },
  { key: "amber",          displayName: "Amber Series",          subtitle: "Amber Jar Candle",  price: 2700, weight: "240g" },
  { key: "signature-luxe", displayName: "Signature Luxe Series", subtitle: "Lidded Candle",     price: 3200, weight: "300g" },
];

// ── Individual pillar / decorative candles ────────────────────────────────────
export const PILLAR_CANDLES = [
  { key: "heart-bubble-candle",   displayName: "Heart Bubble Candle",            scented: 1250, unscented: 1000 },
  { key: "bubble-candle",         displayName: "Bubble Candle",                  scented: 1250, unscented: 1000 },
  { key: "seashell-candle",       displayName: "Seashell Candle",                scented: 1250, unscented: 1000 },
  { key: "puffy-candle",          displayName: "Puffy Candle",                   scented: 1250, unscented: 1000 },
  { key: "dog-candle",            displayName: "Dog Candle",                     scented: 1250, unscented: 1000 },
  { key: "peony-candle",          displayName: "Peony Candle",                   scented: 900,  unscented: 800, weight: "70g" },
  { key: "peony-bud-candle",      displayName: "Peony Bud Candle",               scented: 400,  unscented: 350 },
  { key: "cloud-candle",          displayName: "Cloud Candle",                   scented: 600,  unscented: 550 },
  { key: "3d-heart-candle",       displayName: "3D Heart Candle",                scented: 900,  unscented: 800, weight: "80g" },
  { key: "sun-moon-candle",       displayName: "Sun & Moon Candle",              scented: 850,  unscented: 750 },
  { key: "body-candle",           displayName: "Body Candle",                    scented: 1000, unscented: 850,  weight: "90g" },
  { key: "arch-candle",           displayName: "Arch Candle",                    scented: 1450, unscented: 1100, weight: "230g" },
  { key: "tapered-candle",        displayName: "Tapered Candle",                 scented: 850,  unscented: 750 },
  { key: "spiral-twisted-candle", displayName: "Spiral or Twisted Candle",       scented: 850,  unscented: 750 },
  { key: "mini-bear-candle",      displayName: "Mini Bear Candle",               scented: 375,  unscented: 350 },
  { key: "knot-candle",           displayName: "Knot Candle",                    scented: 1000, unscented: 850,  weight: "90g" },
  { key: "daisy-candle",          displayName: "Daisy Candle",                   scented: 375,  unscented: 350 },
  { key: "mini-bubble-candle",    displayName: "Mini Bubble Candle",             scented: 600,  unscented: 550 },
  { key: "tulip-candle",          displayName: "Tulip Candle",                   scented: 375,  unscented: 350 },
  { key: "rose-bear-candle",      displayName: "Rose Bear Candle",               scented: 1250, unscented: 1000 },
  { key: "rose-heart-candle",     displayName: "Rose Heart Candle",              scented: 700,  unscented: 650 },
  { key: "mini-seashell-candle",  displayName: "Mini Seashell Candle",           scented: 600,  unscented: 550 },
  { key: "small-peony-candle",    displayName: "Small Peony Candle",             scented: 750,  unscented: 700 },
  { key: "big-bear-candle",       displayName: "Big Bear Candle",                scented: 850,  unscented: 750 },
  { key: "cylinder-ribbed-thin",  displayName: "Cylinder Ribbed Candle (Thin)",  scented: 1100, unscented: 900,  weight: "130ml" },
  { key: "ribbed-pierre-300ml",   displayName: "Ribbed Pierre Candle 300ml",     scented: 1800, unscented: 1300, weight: "300ml" },
  { key: "ribbed-pierre-600ml",   displayName: "Ribbed Pierre Candle 600ml",     scented: 2700, unscented: 1700, weight: "600ml" },
  { key: "cylinder-ribbed-thick", displayName: "Cylinder Ribbed Candle (Thick)", scented: 1800, unscented: 1300, weight: "320ml" },
  { key: "sakura-candle",         displayName: "Sakura Candle",                  scented: 1000, unscented: 850,  weight: "90g" },
  { key: "rose-candle",           displayName: "Rose Candle",                    scented: 900,  unscented: 800 },
];

// Helper: does the current category filter match the decorative/pillar section?
function isDecorativeFilter(cat: string | null) {
  if (!cat) return true; // show all
  return ["decorative", "pillar", "decorative-candles", "pillar-candles"].includes(cat);
}

// Helper: does the current category filter match the jar section?
function isJarFilter(cat: string | null) {
  if (!cat) return true; // show all
  return cat === "jar";
}

// ── Bouquet candles ────────────────────────────────────────────────────────────
export const BOUQUET_CANDLES = [
  { key: "mini-bouquet",   displayName: "Mini Bouquet",   price: 1850 },
  { key: "small-bouquet",  displayName: "Small Bouquet",  price: 2800 },
  { key: "medium-bouquet", displayName: "Medium Bouquet", price: 5500 },
];

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("best-selling");
  const [location] = useLocation();
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    const handleLocationChange = () => {
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", handleLocationChange);
    // Also listen for internal navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleLocationChange();
    };
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  const queryParams = useMemo(
    () => new URLSearchParams(search),
    [search],
  );
  const categoryFilter = queryParams.get("category");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryFilter]);

  const categoryTitle = useMemo(() => {
    if (!categoryFilter) return "All Candles";
    if (isDecorativeFilter(categoryFilter)) return "Decorative Candles";
    if (isJarFilter(categoryFilter)) return "Jar Candles";
    return (
      categoryFilter
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") +
      (categoryFilter.toLowerCase().includes("set") ||
      categoryFilter.toLowerCase().includes("ceramic")
        ? ""
        : " Candles")
    );
  }, [categoryFilter]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];
    if (categoryFilter) {
      filtered = filtered.filter((p) => {
        const cat = p.category?.toLowerCase() || "";
        if (isJarFilter(categoryFilter))       return cat.includes("jar");
        if (isDecorativeFilter(categoryFilter)) return cat.includes("decorative") || cat.includes("pillar");
        if (categoryFilter === "bouquet")       return cat.includes("bouquet");
        if (categoryFilter === "gift-sets")     return cat.includes("gift") || cat.includes("set");
        if (categoryFilter === "ceramics")      return cat.includes("ceramic");
        return cat.includes(categoryFilter.toLowerCase());
      });
    }
    if (sortBy === "price-low") filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high") filtered.sort((a, b) => Number(b.price) - Number(a.price));
    return filtered;
  }, [products, categoryFilter, sortBy]);

  const gridClass = viewMode === "grid"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    : "space-y-4";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-secondary py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4 text-foreground lowercase">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of hand-poured candles crafted from 100% pure soy wax and clean,
            refined fragrances, designed to elevate your space and make it unmistakably yours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-secondary transition-colors lowercase"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-foreground animate-spin" />
          </div>
        ) : (
          <div className="space-y-16">

            {/* ── Jar Candles Section ── */}
            {isJarFilter(categoryFilter) && (
              <div>
                {!categoryFilter && (
                  <h2 className="font-serif text-2xl text-foreground mb-6 lowercase">jar candles</h2>
                )}
                <div className={gridClass}>
                  {JAR_CANDLE_SERIES.map((series) => {
                    const dbProduct = products?.find(
                      (p) =>
                        p.slug?.includes(series.key) ||
                        p.name?.toLowerCase().includes(series.displayName.split(" ")[0].toLowerCase()),
                    );
                    return dbProduct ? (
                      <ProductCard
                        key={series.key}
                        product={{ ...dbProduct, name: series.displayName, price: String(series.price) }}
                      />
                    ) : (
                      <StaticProductCard
                        key={series.key}
                        name={series.displayName}
                        subtitle={`${series.subtitle} · ${series.weight}`}
                        price={series.price}
                        viewMode={viewMode}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Decorative / Pillar Candles Section ── */}
            {isDecorativeFilter(categoryFilter) && (
              <div>
                {!categoryFilter && (
                  <h2 className="font-serif text-2xl text-foreground mb-6 lowercase">decorative candles</h2>
                )}
                <div className={gridClass}>
                  {PILLAR_CANDLES.map((candle) => {
                    const dbProduct = products?.find(
                      (p) =>
                        p.slug?.includes(candle.key) ||
                        p.name?.toLowerCase().replace(/\s+/g, "-").includes(candle.key),
                    );
                    return dbProduct ? (
                      <ProductCard
                        key={candle.key}
                        product={{ ...dbProduct, name: candle.displayName, price: String(candle.scented) }}
                      />
                    ) : (
                      <StaticProductCard
                        key={candle.key}
                        name={candle.displayName}
                        priceLine={`Rs.${candle.scented.toLocaleString()} scented · Rs.${candle.unscented.toLocaleString()} unscented`}
                        weight={candle.weight}
                        viewMode={viewMode}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Bouquet Section ── */}
            {categoryFilter === "bouquet" && (
              <div>
                <div className={gridClass}>
                  {BOUQUET_CANDLES.map((bouquet) => {
                    const dbProduct = products?.find(
                      (p) =>
                        p.slug?.includes(bouquet.key) ||
                        p.name?.toLowerCase().includes(bouquet.displayName.toLowerCase()),
                    );
                    return dbProduct ? (
                      <ProductCard
                        key={bouquet.key}
                        product={{ ...dbProduct, name: bouquet.displayName, price: String(bouquet.price) }}
                      />
                    ) : (
                      <StaticProductCard
                        key={bouquet.key}
                        name={bouquet.displayName}
                        price={bouquet.price}
                        viewMode={viewMode}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Other categories (gift-sets, ceramics etc.) ── */}
            {categoryFilter && !isJarFilter(categoryFilter) && !isDecorativeFilter(categoryFilter) && categoryFilter !== "bouquet" && (
              <div className={gridClass}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-muted-foreground">
                    <p className="text-lg lowercase">no products found in this category.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

// ── Static Product Card ───────────────────────────────────────────────────────

function StaticProductCard({
  name,
  subtitle,
  price,
  priceLine,
  weight,
  viewMode,
}: {
  name: string;
  subtitle?: string;
  price?: number;
  priceLine?: string;
  weight?: string;
  viewMode: "grid" | "list";
}) {
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // For static cards, we don't have a real DB ID, but we can't add to cart without one
    // In a real app, these should be in the DB. For now, we'll just show a toast or nothing.
  };

  return (
    <div className="group block h-full">
      <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-lg">
          <div className="w-full h-full flex items-center justify-center bg-secondary/30">
            <span className="text-muted-foreground text-xs lowercase">coming soon</span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        <div className="p-5 flex flex-col flex-grow text-center">
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {subtitle || "Decorative-Candles"}
          </div>
          <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors lowercase">
            {name}
          </h3>
          <div className="mt-auto pt-4 flex flex-col items-center gap-1 border-t border-border/50">
            {priceLine ? (
              <p className="text-sm text-[#c45e4c] font-semibold">{priceLine}</p>
            ) : (
              <p className="text-sm text-[#c45e4c] font-semibold">Rs.{price?.toLocaleString()}.00</p>
            )}
            {weight && <p className="text-[10px] text-muted-foreground">{weight}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}