import { useProducts } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Grid3x3, List } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

// ── Jar candle series ─────────────────────────────────────────────────────────
export const JAR_CANDLE_SERIES = [
  {
    key: "mini-moments",
    displayName: "Mini Moments Series",
    subtitle: "Shot Glass Candle",
    price: 800,
    weight: "60g",
  },
  {
    key: "aurora",
    displayName: "Aurora Series",
    subtitle: "Mini Gold Candle",
    price: 1700,
    weight: "100g",
  },
  {
    key: "eclipse",
    displayName: "Eclipse Series",
    subtitle: "Black Jar Candle",
    price: 2200,
    weight: "—",
  },
  {
    key: "amber",
    displayName: "Amber Series",
    subtitle: "Amber Jar Candle",
    price: 2700,
    weight: "240g",
  },
  {
    key: "signature-luxe",
    displayName: "Signature Luxe Series",
    subtitle: "Lidded Candle",
    price: 3200,
    weight: "300g",
  },
];

// ── Individual pillar / decorative candles ────────────────────────────────────
export const PILLAR_CANDLES = [
  // 150ml
  { key: "heart-bubble-candle",    displayName: "Heart Bubble Candle",             scented: 1200, unscented: 950,  weight: "150ml" },
  { key: "bubble-candle",          displayName: "Bubble Candle",                   scented: 1200, unscented: 950,  weight: "150ml" },
  { key: "seashell-candle",        displayName: "Seashell Candle",                 scented: 1200, unscented: 950,  weight: "150ml" },
  { key: "puffy-candle",           displayName: "Puffy Candle",                    scented: 1200, unscented: 950,  weight: "150ml" },
  { key: "dog-candle",             displayName: "Dog Candle",                      scented: 1200, unscented: 950,  weight: "150ml" },
  { key: "rose-bear-candle",       displayName: "Rose Bear Candle",                scented: 1200, unscented: 950,  weight: "150ml" },
  // 135ml
  { key: "cylinder-ribbed-thin",   displayName: "Cylinder Ribbed Candle (Thin)",   scented: 1150, unscented: 900,  weight: "135ml" },
  // 90ml
  { key: "sakura-candle",          displayName: "Sakura Candle",                   scented: 1050, unscented: 850,  weight: "90ml"  },
  { key: "body-candle",            displayName: "Body Candle",                     scented: 1050, unscented: 850,  weight: "90ml"  },
  { key: "knot-candle",            displayName: "Knot Candle",                     scented: 1050, unscented: 850,  weight: "90ml"  },
  { key: "moon-candle",            displayName: "Moon Candle",                     scented: 1050, unscented: 850,  weight: "90ml"  },
  // 80ml
  { key: "serra-ribbed-candle",    displayName: "Serra Ribbed Candle",             scented: 925,  unscented: 825,  weight: "80ml"  },
  { key: "3d-heart-candle",        displayName: "3D Heart Candle",                 scented: 925,  unscented: 825,  weight: "80ml"  },
  // 70ml
  { key: "peony-candle",           displayName: "Peony Candle",                    scented: 900,  unscented: 800,  weight: "70ml"  },
  // 55ml
  { key: "sun-moon-candle",        displayName: "Sun & Moon Candle",               scented: 850,  unscented: 750,  weight: "55ml"  },
  { key: "rose-candle",            displayName: "Rose Candle",                     scented: 850,  unscented: 750,  weight: "55ml"  },
  { key: "tapered-candle",         displayName: "Tapered Candle",                  scented: 850,  unscented: 750,  weight: "55ml"  },
  { key: "big-bear-candle",        displayName: "Big Bear Candle",                 scented: 850,  unscented: 750,  weight: "55ml"  },
  { key: "rose-bud-candle",        displayName: "Rose Bud Candle",                 scented: 850,  unscented: 750,  weight: "55ml"  },
  { key: "cloud-candle",           displayName: "Cloud Candle",                    scented: 850,  unscented: 750,  weight: "55ml"  },
  // 45ml
  { key: "twisted-candle",         displayName: "Twisted Candle",                  scented: 850,  unscented: 750,  weight: "45ml"  },
  { key: "spiral-candle",          displayName: "Spiral Candle",                   scented: 850,  unscented: 750,  weight: "45ml"  },
  { key: "butterfly-candle",       displayName: "Butterfly Candle",                scented: 750,  unscented: 650,  weight: "45ml"  },
  { key: "mini-seashell-candle",   displayName: "Mini Seashell Candle",            scented: 750,  unscented: 650,  weight: "45ml"  },
  { key: "mini-bubble-candle",     displayName: "Mini Bubble Candle",              scented: 750,  unscented: 650,  weight: "45ml"  },
  { key: "rose-heart-candle",      displayName: "Rose Heart Candle",               scented: 750,  unscented: 650,  weight: "45ml"  },
  { key: "small-peony-candle",     displayName: "Small Peony Candle",              scented: 750,  unscented: 650,  weight: "45ml"  },
  { key: "eid-candle",             displayName: "Eid Candle",                      scented: 750,  unscented: 650,  weight: "45ml"  },
  // 40ml
  { key: "cat-paw-candle",         displayName: "Cat Paw Candle",                  scented: 750,  unscented: 650,  weight: "40ml"  },
  // 230ml
  { key: "arch-candle",            displayName: "Arch Candle",                     scented: 1450, unscented: 1000, weight: "230ml" },
  // large
  { key: "ribbed-pierre-300ml",    displayName: "Short Pierre Ribbed Candle",      scented: 1850, unscented: 1200, weight: "300ml" },
  { key: "cylinder-ribbed-thick",  displayName: "Cylinder Ribbed Candle (Thick)",  scented: 1850, unscented: 1200, weight: "315ml" },
  { key: "ribbed-pierre-600ml",    displayName: "Long Pierre Ribbed Candle",       scented: 2800, unscented: 1600, weight: "600ml" },
  // 20ml
  { key: "daisy-candle",           displayName: "Daisy Candle",                    scented: 425,  unscented: 400,  weight: "20ml"  },
  { key: "peony-bud-candle",       displayName: "Peony Bud Candle",                scented: 425,  unscented: 400,  weight: "20ml"  },
  { key: "tulip-candle",           displayName: "Tulip Candle",                    scented: 425,  unscented: 400,  weight: "20ml"  },
  { key: "mini-bear-candle",       displayName: "Mini Bear Candle",                scented: 400,  unscented: 375,  weight: "20ml"  },
  { key: "macaroon-candle",        displayName: "Macaroon Candle",                 scented: 400,  unscented: 375,  weight: "20ml"  },
];

// Helper: does the current category filter match the decorative/pillar section?
function isDecorativeFilter(cat: string | null) {
  if (!cat) return true; // show all
  return [
    "decorative",
    "pillar",
    "decorative-candles",
    "pillar-candles",
  ].includes(cat);
}

// Helper: does the current category filter match the jar section?
function isJarFilter(cat: string | null) {
  if (!cat) return true; // show all
  return cat === "jar";
}

// ── Bouquet candles ────────────────────────────────────────────────────────────
export const BOUQUET_CANDLES = [
  { key: "mini-bouquet", displayName: "Mini Bouquet", price: 1850 },
  { key: "small-bouquet", displayName: "Small Bouquet", price: 2800 },
  { key: "medium-bouquet", displayName: "Medium Bouquet", price: 5500 },
];

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("best-selling");
  const [location] = useLocation();
  const [search, setSearch] = useState(window.location.search);
  const prevCategoryRef = useRef<string | null>(undefined as any);
  const isBackNavRef = useRef(false);

  useEffect(() => {
    // Detect if this is a back navigation
    isBackNavRef.current = performance.navigation?.type === 2 ||
      (window.history.state && window.history.state.__back === true);

    const handleLocationChange = () => {
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", handleLocationChange);
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      handleLocationChange();
    };

    // Save scroll position when leaving the shop
    const saveScroll = () => {
      sessionStorage.setItem("shop-scroll", String(window.scrollY));
    };
    window.addEventListener("beforeunload", saveScroll);

    // Restore scroll if returning via back
    const savedScroll = sessionStorage.getItem("shop-scroll");
    if (savedScroll) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedScroll));
        sessionStorage.removeItem("shop-scroll");
      });
    }

    return () => {
      saveScroll();
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("beforeunload", saveScroll);
      window.history.pushState = originalPushState;
    };
  }, []);

  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const categoryFilter = queryParams.get("category");

  // Only scroll to top when user actively changes category, not on initial mount/back nav
  useEffect(() => {
    if (prevCategoryRef.current === (undefined as any)) {
      prevCategoryRef.current = categoryFilter;
      return;
    }
    if (prevCategoryRef.current !== categoryFilter) {
      prevCategoryRef.current = categoryFilter;
      window.scrollTo(0, 0);
    }
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
        if (isJarFilter(categoryFilter)) return cat.includes("jar");
        if (isDecorativeFilter(categoryFilter))
          return cat.includes("decorative") || cat.includes("pillar");
        if (categoryFilter === "bouquet") return cat.includes("bouquet");
        if (categoryFilter === "gift-sets")
          return cat.includes("gift") || cat.includes("set");
        if (categoryFilter === "ceramics") return cat.includes("ceramic");
        return cat.includes(categoryFilter.toLowerCase());
      });
    }
    if (sortBy === "price-low")
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high")
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    return filtered;
  }, [products, categoryFilter, sortBy]);

  const sortedPillarCandles = useMemo(() => {
    const arr = [...PILLAR_CANDLES];
    if (sortBy === "price-low") arr.sort((a, b) => a.unscented - b.unscented);
    if (sortBy === "price-high") arr.sort((a, b) => b.unscented - a.unscented);
    return arr;
  }, [sortBy]);

  const sortedJarSeries = useMemo(() => {
    const arr = [...JAR_CANDLE_SERIES];
    if (sortBy === "price-low") arr.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [sortBy]);

  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4"
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
            Explore our collection of hand-poured candles crafted from 100% pure
            soy wax and clean, refined fragrances, designed to elevate your
            space and make it unmistakably yours.
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
                viewMode === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
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
                  <h2 className="font-serif text-2xl text-foreground mb-6 lowercase">
                    jar candles
                  </h2>
                )}
                <div className={gridClass}>
                  {sortedJarSeries.map((series) => {
                    const dbProduct = products?.find(
                      (p) =>
                        p.slug?.includes(series.key) ||
                        p.name
                          ?.toLowerCase()
                          .includes(
                            series.displayName.split(" ")[0].toLowerCase(),
                          ),
                    );
                    return dbProduct ? (
                      <ProductCard
                        key={series.key}
                        product={{
                          ...dbProduct,
                          name: series.displayName,
                          price: String(series.price),
                        }}
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
                  <h2 className="font-serif text-2xl text-foreground mb-6 lowercase">
                    decorative candles
                  </h2>
                )}
                <div className={gridClass}>
                  {sortedPillarCandles.map((candle) => (
                    <StaticProductCard
                      key={candle.key}
                      name={candle.displayName}
                      priceLine={`Starting Rs.${candle.unscented.toLocaleString()}`}
                      weight={candle.weight}
                      viewMode={viewMode}
                      href={`/product/candle/${candle.key}`}
                    />
                  ))}
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
                        p.name
                          ?.toLowerCase()
                          .includes(bouquet.displayName.toLowerCase()),
                    );
                    return dbProduct ? (
                      <ProductCard
                        key={bouquet.key}
                        product={{
                          ...dbProduct,
                          name: bouquet.displayName,
                          price: String(bouquet.price),
                        }}
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
            {categoryFilter &&
              !isJarFilter(categoryFilter) &&
              !isDecorativeFilter(categoryFilter) &&
              categoryFilter !== "bouquet" && (
                <div className={gridClass}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                      <p className="text-lg lowercase">
                        no products found in this category.
                      </p>
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
  href,
}: {
  name: string;
  subtitle?: string;
  price?: number;
  priceLine?: string;
  weight?: string;
  viewMode: "grid" | "list";
  href?: string;
}) {
  const inner = (
    <div className="group block cursor-pointer">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-secondary/30 mb-3 flex items-center justify-center">
        <span className="text-muted-foreground text-xs lowercase">coming soon</span>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      <div className="text-center mt-3">
        <h3 className="text-base font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="mt-1.5 text-base font-semibold text-[#c45e4c]">
          {priceLine ? priceLine : `Rs.${price?.toLocaleString()}.00`}
        </p>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
