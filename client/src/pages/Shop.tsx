import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Grid3x3, List } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("best-selling");
  const [location] = useLocation();

  const queryParams = useMemo(() => new URLSearchParams(window.location.search), [location]);
  const categoryFilter = queryParams.get("category");

  const categoryTitle = useMemo(() => {
    if (!categoryFilter) return "All Candles";
    return categoryFilter
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + (categoryFilter.toLowerCase().includes("set") || categoryFilter.toLowerCase().includes("ceramic") ? "" : " Candles");
  }, [categoryFilter]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];

    if (categoryFilter) {
      filtered = filtered.filter(p => {
        const cat = p.category?.toLowerCase() || "";
        if (categoryFilter === "jar") return cat.includes("jar");
        if (categoryFilter === "bouquet") return cat.includes("bouquet");
        if (categoryFilter === "decorative") return cat.includes("decorative");
        if (categoryFilter === "gift-sets") return cat.includes("gift") || cat.includes("set");
        if (categoryFilter === "ceramics") return cat.includes("ceramic");
        return cat.includes(categoryFilter.toLowerCase());
      });
    }

    // Sorting logic
    if (sortBy === "price-low") filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-high") filtered.sort((a, b) => Number(b.price) - Number(a.price));
    
    return filtered;
  }, [products, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground lowercase">{categoryTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite collection of luxury hand poured candles made with 100% pure BeeSoy wax and clean fragrances that truly make your space uniquely yours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* View Mode Toggle */}
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

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-secondary transition-colors lowercase"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-foreground animate-spin" />
          </div>
        ) : (
          <div className={`${viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-4"}`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
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
    </div>
  );
}
