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
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: allProducts } = useProducts();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("crème");
  const [selectedScent, setSelectedScent] = useState("flower meadows");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  const decorativeTypes = [
    { name: "Sakura/Body/Knot", weight: "90g" },
    { name: "Short Ribbed", weight: "300g" },
    { name: "Long Pierre", weight: "600g" },
    { name: "Cylinder Ribbed", weight: "135g" },
    { name: "Cylinder Ribbed Thick", weight: "315g" },
    { name: "Mini Bubble/Rose Heart/Cloud", weight: "40g" },
    { name: "Arch", weight: "230g" },
    { name: "Bubble Heart/Bubble/Seashell/Puffy/Rose Bear/Dog", weight: "140g" },
    { name: "Twisted", weight: "35g" },
    { name: "Spirals/Mini Seashell/Small Peony/Twisted/Rose Bud", weight: "45g" },
    { name: "Mini Bear", weight: "15g" },
    { name: "Daisy/Peony Bud/Tulip", weight: "20g" },
    { name: "Peony", weight: "70g" },
    { name: "Sun/Aromatic Rose/Tapered/Big Bear/Rose", weight: "55g" },
    { name: "3D Heart", weight: "80g" }
  ];

  const scents = [
    "flower meadows",
    "butterscotch", 
    "pink chiffon",
    "alexandria library",
    "oudh e bakhoor",
    "ocean breeze",
    "serenity"
  ];

  const scentDescriptions: Record<string, { notes: string; description: string }> = {
    "flower meadows": {
      notes: "Jasmine, Rose, Fresh Greens",
      description: "A delicate bouquet of wildflowers dancing in a sunlit meadow. Fresh and romantic."
    },
    "butterscotch": {
      notes: "Vanilla, Amber",
      description: "Warm and indulgent with creamy vanilla swirled into rich amber. Comforting and sweet."
    },
    "pink chiffon": {
      notes: "Peony, Musk, Soft Florals",
      description: "Light and airy like delicate fabric, with soft peony and a whisper of musk."
    },
    "alexandria library": {
      notes: "Aged Paper, Sandalwood, Leather",
      description: "The scent of ancient wisdom—aged parchment, warm sandalwood, and worn leather bindings."
    },
    "oudh e bakhoor": {
      notes: "Oud, Saffron, Rose",
      description: "An opulent Middle Eastern blend of precious oud, golden saffron, and damascena rose."
    },
    "ocean breeze": {
      notes: "Sea Salt, Driftwood, Coconut",
      description: "A refreshing coastal escape with crisp sea salt, sun-bleached driftwood, and tropical coconut."
    },
    "serenity": {
      notes: "Lavender, Chamomile, Eucalyptus",
      description: "A calming sanctuary of French lavender, gentle chamomile, and fresh eucalyptus."
    }
  };

  const isJarCandle = product?.category?.toLowerCase().includes("jar");
  const isDecorativeCandle = product?.category?.toLowerCase().includes("decorative");

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
            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border-2 border-muted-foreground/20">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-muted-foreground/10">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover opacity-70 rounded-lg"
                />
              </div>
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-muted-foreground/10">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover opacity-70 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif text-primary">
              {product.name}
            </h1>

            {/* Price */}
            <div>
              <p className="text-lg text-[#c45e4c] font-semibold">
                Rs.{price.toLocaleString()}.00
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
              </p>
            </div>


            {/* Type/Weight Selector - for decorative candles */}
            {isDecorativeCandle && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">type</p>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full bg-muted border-0" data-testid="select-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {decorativeTypes.map((type) => (
                      <SelectItem key={type.name} value={type.name}>
                        {type.name} ({type.weight})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selector - for decorative candles only */}
            {isDecorativeCandle && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">color</p>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full bg-muted border-0" data-testid="select-color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crème">crème</SelectItem>
                    <SelectItem value="rose">rose</SelectItem>
                    <SelectItem value="sage">sage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Scent Selector - for jar candles and decorative candles */}
            {(isJarCandle || isDecorativeCandle) && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">scent</p>
                <Select value={selectedScent} onValueChange={setSelectedScent}>
                  <SelectTrigger className="w-full bg-muted border-0" data-testid="select-scent">
                    <SelectValue placeholder="Select scent" />
                  </SelectTrigger>
                  <SelectContent>
                    {scents.map((scent) => (
                      <SelectItem key={scent} value={scent}>{scent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Scent Notes & Description */}
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

            {/* Quantity Selector */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Quantity</p>
              <div className="flex items-center border border-muted-foreground/20 rounded-sm bg-muted w-fit">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-muted/50 transition-colors text-muted-foreground"
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm text-foreground">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 hover:bg-muted/50 transition-colors text-muted-foreground"
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="w-full py-4 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm"
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
          <h2 className="text-2xl font-serif text-primary italic mb-8 text-center">
            more cute stuff for your liking
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allProducts && allProducts
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

        {/* Customer Reviews Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-2xl font-serif text-primary text-center mb-8">
            Customer Reviews
          </h2>
          <div className="text-center">
            <p className="text-muted-foreground mb-6">No reviews yet. Be the first to share your thoughts!</p>
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
