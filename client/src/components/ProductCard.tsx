import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { useAddToCart } from "@/hooks/use-cart";
import { Loader2, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        <button
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
          data-testid={`btn-add-to-cart-${product.id}`}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          {addToCart.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
        </button>
      </div>
      <div>
        <h3 className="text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-[#c45e4c]">
          Rs.{Number(product.price).toLocaleString()}.00
        </p>
      </div>
    </Link>
  );
}
