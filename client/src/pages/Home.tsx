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

      {/* Explore More Section (Categories) */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">Explore More</h2>
          <div className="h-0.5 w-24 bg-foreground/20 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Candles", image: "/images/candles-hero.jpeg" },
            { name: "Reed Diffusers", image: "/images/candles-collection.jpeg" },
            { name: "Room & Linen Mists", image: "/images/candles-hero.jpeg" },
            { name: "Bath & Body", image: "/images/candles-collection.jpeg" },
            { name: "Specialty Tea", image: "/images/candles-hero.jpeg" },
            { name: "Gift Sets", image: "/images/candles-collection.jpeg" },
          ].map((cat, i) => (
            <Link key={i} href={`/shop?category=${cat.name.toLowerCase()}`}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <h3 className="text-white text-sm md:text-base font-medium text-center leading-tight">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-muted py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground lowercase">our values</h2>
            <div className="h-px w-32 bg-foreground/10 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { 
                title: "woman owned business", 
                subtitle: "empowering women every day",
                icon: (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-4 fill-foreground/20 stroke-foreground/40 stroke-1">
                    <circle cx="50" cy="50" r="40" fill="none" />
                    <path d="M50 30 C40 30 35 40 35 50 C35 65 50 75 50 75 C50 75 65 65 65 50 C65 40 60 30 50 30 Z" />
                  </svg>
                )
              },
              { 
                title: "handmade with love", 
                subtitle: "crafted carefully by hand",
                icon: (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-4 fill-foreground/20 stroke-foreground/40 stroke-1">
                    <circle cx="50" cy="50" r="40" fill="none" />
                    <path d="M30 50 Q30 35 50 35 Q70 35 70 50 Q70 70 50 85 Q30 70 30 50" />
                  </svg>
                )
              },
              { 
                title: "made in Pakistan", 
                subtitle: "proudly local craftsmanship",
                icon: (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-4 fill-foreground/20 stroke-foreground/40 stroke-1">
                    <circle cx="50" cy="50" r="40" fill="none" />
                    <path d="M40 50 L60 50 M50 40 L50 60" transform="rotate(45 50 50)" />
                  </svg>
                )
              },
              { 
                title: "charitable contributions", 
                subtitle: "giving back to our community",
                icon: (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-4 fill-foreground/20 stroke-foreground/40 stroke-1">
                    <circle cx="50" cy="50" r="40" fill="none" />
                    <rect x="35" y="45" width="30" height="25" rx="2" />
                    <path d="M35 45 L50 35 L65 45" />
                  </svg>
                )
              },
            ].map((value, i) => (
              <div key={i} className="text-center group">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="font-serif text-lg text-foreground mb-1 lowercase">{value.title}</h3>
                <p className="text-xs text-muted-foreground italic lowercase">{value.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground lowercase">customer reviews</h2>
          <div className="h-px w-32 bg-foreground/10 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              name: "Saad Raza",
              text: "huge huge HUGE fan of your work! its amazing! 😍",
              image: "/images/candles-hero.jpeg",
            },
            {
              name: "Zaynah",
              text: "just opened it! it's really beautiful i'm obsessed! smells so ethereal and very pinterest style ✨🎀",
              image: "/images/candles-collection.jpeg",
            },
            {
              name: "meenaghorii",
              text: "A must-have for any matcha lover 💚",
              image: "/images/candles-hero.jpeg",
            },
          ].map((review, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm rotate-1 group hover:rotate-0 transition-transform duration-300">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm italic text-muted-foreground mb-3 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="text-xs font-serif font-bold tracking-widest text-foreground/60 uppercase">
                    -{review.name}
                  </span>
                  <div className="flex gap-0.5 justify-center md:justify-start">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-2.5 h-2.5 fill-foreground text-foreground" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Section (Moved here after customer favorites/reviews) */}
      <section className="py-16 md:py-24 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground lowercase italic">our insta is kind of cute</h2>
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
              <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted group cursor-pointer">
                <img src={img} alt="Instagram post" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
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
