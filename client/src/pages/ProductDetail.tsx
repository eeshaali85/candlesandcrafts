import { useRoute } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: allProducts } = useProducts();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("crème");

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

  const price = Number(product.price);

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
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
            <div className="aspect-square bg-white rounded-sm overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-white rounded-sm overflow-hidden border-2 border-muted-foreground/20">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 bg-white rounded-sm overflow-hidden border border-muted-foreground/10">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              <div className="w-20 h-20 bg-white rounded-sm overflow-hidden border border-muted-foreground/10">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif text-[#8b6b5a]">
              {product.name}
            </h1>

            {/* Price */}
            <div>
              <p className="text-lg text-[#8b6b5a]">
                Rs.{price.toLocaleString()}.00 PKR
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
              </p>
            </div>

            {/* Color Selector */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">color</p>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full bg-white border-muted-foreground/20" data-testid="select-color">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crème">crème</SelectItem>
                  <SelectItem value="rose">rose</SelectItem>
                  <SelectItem value="sage">sage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selector */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Quantity</p>
              <div className="flex items-center border border-muted-foreground/20 rounded-sm bg-white w-fit">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-muted/50 transition-colors text-muted-foreground"
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 hover:bg-muted/50 transition-colors text-muted-foreground"
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="w-full py-6 rounded-full bg-[#d4b5a0] hover:bg-[#c4a590] text-[#5a4a42] font-medium text-base"
              data-testid="button-add-to-cart"
            >
              {addToCart.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add to cart
            </Button>

            {/* Product Description */}
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

        {/* Related Products Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-serif text-[#8b6b5a] italic mb-8">
            more cute stuff for your liking
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allProducts && allProducts
              .filter((p: any) => p.id !== id)
              .slice(0, 4)
              .map((relatedProduct: any) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-white rounded-sm mb-3">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-sm text-center text-[#8b6b5a] font-medium mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-center text-[#c4a590]">
                      Rs.{parseFloat(relatedProduct.price).toLocaleString()}.00 PKR
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-2xl font-serif text-[#8b6b5a] text-center mb-8">
            Customer Reviews
          </h2>
          <div className="text-center text-muted-foreground">
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
