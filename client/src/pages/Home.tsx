import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Star, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import candlesStock from "@assets/stock_images/handcrafted_candles__78dd0cf3.jpg";
import homewareStock from "@assets/stock_images/modern_minimalist_ho_efcfdea8.jpg";
import bouquetsStock from "@assets/stock_images/flower_bouquet_candl_69966b97.jpg";
import vesselStock from "@assets/stock_images/vessel_candle_with_f_e840b005.jpg";
import luxuryGiftStock from "@assets/stock_images/luxury_custom_gift_b_d50df118.jpg";
import iconNonToxic from "@assets/icon-non-toxic.png";
import iconEcoFriendly from "@assets/icon-eco-friendly.png";
import iconCuteCandle from "@assets/icon-cute-candle.png";
import iconHandmadeLove from "@assets/icon-handmade-love.png";

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const bestSellers = Array.isArray(products) ? products : [];

  const categories = [
    { name: "candles", image: candlesStock, href: "/shop?category=candle", shape: "blob-1" },
    { name: "homeware", image: homewareStock, href: "/shop?category=ceramics", shape: "blob-2" },
    { name: "bouquets", image: bouquetsStock, href: "/shop?category=bouquet", shape: "blob-3" },
    { name: "vessel candles", image: vesselStock, href: "/shop?category=jar", shape: "blob-4" },
  ];

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
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 max-w-2xl lowercase">
            scents that speak to the soul
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 lowercase">
            from our hands to your home, we bring you fragrances that uplift, inspire, and create a sense of belonging.
          </p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="bg-secondary py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground font-normal mb-4 lowercase">
            made with intention
          </h2>
          <p className="text-lg text-muted-foreground mb-6 lowercase">
            made in pakistan, with love for your home. each candle is crafted with premium ingredients and care.
          </p>
          <Link href="/our-story">
            <Button variant="default">
              step inside candlesandcrafts
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-6 md:py-8 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground font-normal lowercase">best sellers</h2>
          <div className="h-px w-32 bg-foreground/30 mx-auto mt-2" />
        </div>

        <div className="px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {bestSellers.map((product: any) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <Link href={`/shop#product-${product.id}`}>
                      <div className="group cursor-pointer">
                        <div className="aspect-square overflow-hidden bg-muted mb-4 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {product.stock === 0 && (
                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-widest">
                              Sold out
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-serif text-base text-foreground lowercase">{product.name}</h3>
                          <p className="text-[11px] text-muted-foreground lowercase leading-tight">
                            {product.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground lowercase italic">
                            scented candle
                          </p>
                          <p className="text-sm font-medium text-foreground mt-2">
                            Rs.{parseFloat(product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-0 bg-black/5 hover:bg-black/10" />
              <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-0 bg-black/5 hover:bg-black/10" />
            </Carousel>
          )}
        </div>
      </section>

      {/* Explore More Section */}
      <section className="py-6 md:py-8 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground font-normal lowercase">explore more</h2>
          <div className="h-px w-32 bg-foreground/30 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "candles", image: "/images/candles-hero.jpeg", href: "/shop?category=candle" },
            { name: "reed diffusers", image: "/images/candles-collection.jpeg", href: "/shop?category=diffuser" },
            { name: "room & linen mists", image: "/images/candles-hero.jpeg", href: "/shop?category=mist" },
            { name: "bath & body", image: "/images/candles-collection.jpeg", href: "/shop?category=bath" },
            { name: "specialty tea", image: "/images/candles-hero.jpeg", href: "/shop?category=tea" },
            { name: "gift sets", image: "/images/candles-collection.jpeg", href: "/shop?category=gift-sets" },
          ].map((cat, i) => (
            <Link key={i} href={cat.href}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-md cursor-pointer">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-end justify-center p-4">
                  <h3 className="text-white text-xs md:text-sm font-medium text-center leading-tight mb-2">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Custom Gifting Banner */}
      <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${luxuryGiftStock})`,
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative h-full px-8 md:px-16 flex items-center">
            <div className="max-w-md text-white">
              <h2 className="text-3xl md:text-4xl font-serif mb-4 lowercase">custom gifting, made easy.</h2>
              <p className="text-lg text-white/90 mb-8 lowercase">your ideas, our craftsmanship. let's make something uniquely yours.</p>
              <Link href="/giveaways">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 border-0 lowercase">
                  get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-muted py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground font-normal lowercase">our values</h2>
            <div className="h-px w-32 bg-foreground/30 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { title: "non-toxic", image: iconNonToxic },
              { title: "eco-friendly", image: iconEcoFriendly },
              { title: "cute AF", image: iconCuteCandle },
              { title: "handmade w/ love", image: iconHandmadeLove },
            ].map((value, i) => (
              <div key={i} className="text-center group">
                <div className="transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={value.image} 
                    alt={value.title} 
                    className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain mix-blend-multiply"
                  />
                </div>
                <h3 className="font-serif text-base md:text-lg text-foreground lowercase">{value.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-8 md:py-12 px-4 bg-card overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground font-normal lowercase tracking-tight">customer reviews</h2>
            <div className="h-px w-32 bg-foreground/30 mx-auto mt-4" />
          </div>

          <div className="px-4 md:px-12">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent className="-ml-4">
                {[
                  {
                    handle: "@nimrakhan_official",
                    text: "This was the most creative way I could start my birthday! Who knew breakfast in bed could be so magical with your egg & toast candle!!😭",
                    image: "/images/candles-hero.jpeg",
                    verified: true
                  },
                  {
                    handle: "@meenaghorii",
                    text: "So pretty! I loved it ✨💕",
                    image: "/images/candles-collection.jpeg",
                    verified: true
                  },
                  {
                    handle: "@Fatima Sajjad",
                    text: "Its SO BEAUTIFUL! Fits my room's vibe perfectly 🎀🎀",
                    image: "/images/candles-hero.jpeg",
                    verified: false
                  },
                  {
                    handle: "@sara_shaikh",
                    text: "The scent is so calming, perfect for my workspace! 🕯️✨",
                    image: "/images/candles-collection.jpeg",
                    verified: true
                  },
                  {
                    handle: "@zainab_ali",
                    text: "Obsessed with the packaging! Makes such a perfect gift. 🎁",
                    image: "/images/candles-hero.jpeg",
                    verified: true
                  }
                ].map((review, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="flex gap-6 items-start group">
                      {/* Image Card */}
                      <div className="w-1/2 aspect-[4/5] rounded-sm overflow-hidden bg-muted shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                        <img
                          src={review.image}
                          alt={review.handle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="w-1/2 pt-4 relative">
                        {/* Text */}
                        <p className="text-[11px] md:text-xs text-foreground/80 leading-relaxed mb-4 font-light italic">
                          {review.text}
                        </p>
                        
                        {/* Handle & Verified */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <span className="text-[10px] text-muted-foreground font-medium">{review.handle}</span>
                          {review.verified && (
                            <CheckCircle2 className="w-3 h-3 text-[#3897f0] fill-[#3897f0] stroke-white stroke-[2]" />
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-[#4a4a4a] text-[#4a4a4a]" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-0 bg-black/5 hover:bg-black/10" />
              <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-0 bg-black/5 hover:bg-black/10" />
            </Carousel>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-1.5 mt-16">
            {Array.from({ length: count }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => api?.scrollTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-foreground w-4' : 'bg-foreground/20'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 px-4 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground font-normal lowercase">frequently asked questions</h2>
          <div className="h-px w-32 bg-foreground/30 mx-auto mt-4" />
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
