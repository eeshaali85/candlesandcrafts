import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Filter, Grid3x3, List } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "jar-candles", label: "Jar Candles" },
  { value: "pillar-candles", label: "Pillar Candles" },
  { value: "bouquets", label: "Bouquets" },
  { value: "gift-sets", label: "Gift Sets" },
];

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("best-selling");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get category from URL params
  const params = new URLSearchParams(location.split("?")[1]);
  const selectedCategory = params.get("category") || "all";

  const filteredProducts = products?.filter(p => 
    selectedCategory === "all" || p.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">All Candles</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite collection of luxury hand poured candles made with 100% pure BeeSoy wax and clean fragrances that truly make your space uniquely yours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-serif text-lg font-bold mb-4 text-primary">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <a
                    key={category.value}
                    href={category.value === "all" ? "/" : `/?category=${category.value}`}
                    className={`block px-4 py-3 rounded-md transition-all font-medium ${
                      selectedCategory === category.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <h3 className="font-serif text-lg font-bold mb-4 mt-4 text-primary">Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <a
                        key={category.value}
                        href={category.value === "all" ? "/" : `/?category=${category.value}`}
                        onClick={() => setIsFilterOpen(false)}
                        className={`block px-4 py-3 rounded-md transition-all font-medium ${
                          selectedCategory === category.value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {category.label}
                      </a>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list" 
                      ? "bg-primary text-primary-foreground" 
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
                className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-secondary transition-colors"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : (
              <>
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
                      <p className="text-lg">No products found in this category.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
