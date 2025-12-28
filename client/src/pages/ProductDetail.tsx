import { useRoute, useLocation } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const id = params ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-8 hover:bg-transparent hover:text-primary p-0 flex items-center gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col h-full pt-8 lg:pt-0">
            <div className="mb-8">
              <span className="text-sm font-medium text-primary uppercase tracking-widest mb-2 block">
                {product.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-light text-primary">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            <div className="prose prose-stone max-w-none mb-10 text-muted-foreground leading-relaxed text-lg">
              <p>{product.description}</p>
            </div>

            <div className="border-t border-border pt-8 mt-auto">
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                {/* Quantity Selector */}
                <div className="flex items-center border border-border rounded-full h-14 w-full sm:w-40 px-4 justify-between bg-white">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:text-primary transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="flex-1 h-14 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {addToCart.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 mr-2" />
                  )}
                  Add to Cart
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <h4 className="font-serif font-bold text-sm mb-1">Free Shipping</h4>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <h4 className="font-serif font-bold text-sm mb-1">Handmade</h4>
                  <p className="text-xs text-muted-foreground">Small batch production</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
