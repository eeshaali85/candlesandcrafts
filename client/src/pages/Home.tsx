import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const bestSellers = products?.slice(0, 4) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/candles-hero.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 max-w-2xl">
            Scents That Speak to the Soul
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8">
            From our hands to your home, we bring you fragrances that uplift, inspire, and create a sense of belonging.
          </p>
          <Link href="/shop">
            <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
              Explore Our Collection
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="bg-secondary py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
            Made with intention
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Made in Pakistan, with love for your home. Each candle is crafted with premium ingredients and care.
          </p>
          <Link href="/our-story">
            <Button variant="default">
              Step Inside Honey, I'm Home
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Customer Favorites</h2>
          <div className="h-1 w-24 bg-accent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : bestSellers.map((product: any) => (
                <Link key={product.id} href={`/shop#product-${product.id}`}>
                  <Card className="overflow-hidden hover-elevate transition-all cursor-pointer h-full flex flex-col">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-semibold text-foreground">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="default" size="lg">
              View All Products
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-muted py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">Our Values</h2>
            <div className="h-1 w-24 bg-accent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Non-Toxic", description: "Safe for your home and loved ones" },
              { title: "Eco-Friendly", description: "Sustainable and responsible sourcing" },
              { title: "Handcrafted", description: "Made with care and attention to detail" },
              { title: "With Love", description: "Every candle made with intention" },
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  ✨
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">from 41 reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Malveen",
              text: "Love the service and quality. I've ordered from them so many times, and have gotten this candle in almost every colour. They have...",
            },
            {
              name: "Aiman Masood",
              text: "Excellent quality! The candles are beautifully made and smell amazing. Highly recommended!",
            },
            {
              name: "Rubis Nasir",
              text: "The matchbox is such good quality and it's super cute. Loveeee it!",
            },
          ].map((review, i) => (
            <Card key={i} className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{review.text}</p>
              <p className="font-semibold text-foreground text-sm">{review.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">Our Instagram</h2>
            <p className="text-muted-foreground mt-2">Follow us for daily inspiration</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              "/images/candles-hero.jpeg",
              "/images/candles-collection.jpeg",
              "/images/candles-hero.jpeg",
              "/images/candles-collection.jpeg",
              "/images/candles-hero.jpeg",
              "/images/candles-collection.jpeg",
            ].map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted">
                <img src={img} alt="Instagram post" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Frequently Asked Questions</h2>
          <div className="h-1 w-24 bg-accent mx-auto mt-4" />
        </div>

        <div className="space-y-3">
          {[
            "What is your delivery timeline?",
            "What are your payment modes?",
            "What are your shipping charges?",
            "Do you ship worldwide?",
            "What's the best way to care for your products?",
            "Do you make custom candles?",
          ].map((question, i) => (
            <Card key={i} className="p-4 cursor-pointer hover-elevate transition-all">
              <button className="w-full text-left font-medium text-foreground flex items-center justify-between">
                {question}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
