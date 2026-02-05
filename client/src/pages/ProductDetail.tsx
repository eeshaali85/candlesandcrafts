import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Minus, Plus, Heart, ArrowLeft } from "lucide-react";
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
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("3.5 fl oz");
  const [activeTab, setActiveTab] = useState("details");
  const [noteCard, setNoteCard] = useState("");
  const [addons, setAddons] = useState({
    giftBag: false,
    ribbon: false,
    giftWrap: false,
  });

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

  const originalPrice = Number(product.price);
  const salePrice = originalPrice * 0.8;
  const discountPercent = 20;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/shop">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-transparent p-0 flex items-center gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
              -{discountPercent}%
            </div>
            <div className="aspect-square bg-stone-100 rounded-md overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-serif text-foreground mb-1">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-sm mb-1">Oud & Jasmine</p>
              <p className="text-muted-foreground text-sm mb-4">Scented Candle</p>
              
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground line-through text-lg">
                  Rs.{originalPrice.toLocaleString()}
                </span>
                <span className="text-red-500 text-xl font-medium">
                  Rs.{salePrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2 uppercase tracking-wide">Size: 3.5 FL OZ.</p>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full border-muted-foreground/30" data-testid="select-size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.5 fl oz">3.5 fl oz</SelectItem>
                  <SelectItem value="7 fl oz">7 fl oz</SelectItem>
                  <SelectItem value="12 fl oz">12 fl oz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-muted-foreground/30 rounded-md">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wider font-medium"
                data-testid="button-add-to-cart"
              >
                {addToCart.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Add to Cart
              </Button>

              <Button 
                variant="outline" 
                size="icon"
                className="border-muted-foreground/30"
                data-testid="button-wishlist"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Addons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Addons</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox 
                    checked={addons.giftBag}
                    onCheckedChange={(checked) => setAddons({...addons, giftBag: checked as boolean})}
                    data-testid="checkbox-gift-bag"
                  />
                  <span className="text-sm text-foreground">Gift Bag (+Rs 200)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox 
                    checked={addons.ribbon}
                    onCheckedChange={(checked) => setAddons({...addons, ribbon: checked as boolean})}
                    data-testid="checkbox-ribbon"
                  />
                  <span className="text-sm text-foreground">Ribbon to the box (+Rs 50)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox 
                    checked={addons.giftWrap}
                    onCheckedChange={(checked) => setAddons({...addons, giftWrap: checked as boolean})}
                    data-testid="checkbox-gift-wrap"
                  />
                  <span className="text-sm text-foreground">Gift Wrap (+Rs 200)</span>
                </label>
              </div>
            </div>

            {/* Note Card */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Note Card</p>
              <Input 
                value={noteCard}
                onChange={(e) => setNoteCard(e.target.value)}
                placeholder="Add a personal message..."
                className="border-muted-foreground/30"
                data-testid="input-note-card"
              />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex justify-center gap-8 border-b border-muted-foreground/20 mb-8">
            {[
              { id: "details", label: "Product Details" },
              { id: "howto", label: "How to use" },
              { id: "shipping", label: "Shipping and return" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "border-b-2 border-foreground text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl mx-auto">
            {activeTab === "details" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="font-medium text-foreground mb-1">Top Notes:</p>
                    <p className="text-muted-foreground">Poets Jasmine</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Heart Notes:</p>
                    <p className="text-muted-foreground">Spanish Cedar</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Base Notes:</p>
                    <p className="text-muted-foreground">Oud</p>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    A signature blend of royal white florals and oud. Immerse your space in its luxuriant sweetness. 
                    A traditional, elegant aroma signifying spiritual healing, grounding and peace.
                  </p>
                  <p>
                    Each product is packaged in our signature upcycled individual boxes and shipped in recyclable boxes.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "howto" && (
              <div className="space-y-4 text-muted-foreground">
                <p>
                  For the best experience, trim the wick to 1/4 inch before each lighting. 
                  Allow the candle to burn until the wax melts evenly across the surface to prevent tunneling.
                </p>
                <p>
                  Never leave a burning candle unattended. Keep away from drafts, children, and pets.
                  Burn for no more than 4 hours at a time.
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our products are made to order. Please allow 7-10 days for dispatch.
                  Standard shipping within Pakistan takes 3-5 business days.
                </p>
                <p>
                  Returns are accepted within 14 days of delivery for unused, unopened items in original packaging.
                  Please contact us at candlesandcraftss@gmail.com to initiate a return.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted-foreground/20 py-4 px-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground line-through">Rs.{originalPrice.toLocaleString()}</span>
                <span className="text-red-500">Rs.{salePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-32 border-muted-foreground/30" data-testid="select-size-bottom">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3.5 fl oz">3.5 fl oz</SelectItem>
                <SelectItem value="7 fl oz">7 fl oz</SelectItem>
                <SelectItem value="12 fl oz">12 fl oz</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border border-muted-foreground/30 rounded-md">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 hover:bg-muted transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button 
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wider font-medium px-8"
              data-testid="button-add-to-cart-bottom"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom padding for sticky bar */}
      <div className="h-24" />
    </div>
  );
}
