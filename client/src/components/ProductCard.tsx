import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { Loader2, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          
          <div className="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="icon"
              className="rounded-full shadow-lg bg-white text-primary"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              {addToCart.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.series || product.category}
          </div>
          <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
            <span className="font-semibold text-lg text-[#c45e4c]">
              Rs.{Number(product.price).toLocaleString()}.00
            </span>
            <span className="text-sm text-muted-foreground font-hand">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
