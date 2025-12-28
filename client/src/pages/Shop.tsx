import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Floral", "Woody", "Fresh", "Spiced"];

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products?.filter(p => 
    selectedCategory === "All" || p.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4 text-primary">Our Collection</h1>
          <p className="text-muted-foreground max-w-xl mx-auto font-light text-lg">
            Discover our range of handcrafted soy candles, each designed to bring a unique atmosphere to your space.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 transition-all ${
                selectedCategory === category 
                  ? "bg-primary text-white shadow-lg" 
                  : "bg-transparent border-primary/20 hover:border-primary hover:bg-primary/5 text-foreground"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts?.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No products found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
