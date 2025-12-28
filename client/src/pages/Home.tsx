import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Leaf, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { data: products } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/candles-hero.jpeg" 
            alt="Artisan Candles" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block font-hand text-2xl md:text-3xl mb-4 text-primary-foreground/90"
          >
            Handcrafted with love
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            Light Your Soul
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-xl mx-auto text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light"
          >
            Experience the warmth of artisanal soy candles, poured in small batches for the perfect ambiance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/shop">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full text-lg font-medium shadow-2xl hover:shadow-white/20 transition-all hover:scale-105">
                Shop Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Leaf, title: "100% Organic Soy", desc: "Eco-friendly and sustainable ingredients only." },
              { icon: Heart, title: "Hand Poured", desc: "Crafted in small batches with personal care." },
              { icon: Star, title: "Premium Scents", desc: "Curated fragrances that last longer." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-primary font-hand text-xl block mb-2">Our favorites</span>
              <h2 className="font-serif text-4xl font-bold text-foreground">Featured Candles</h2>
            </div>
            <Link href="/shop">
              <Button variant="link" className="text-primary hover:text-primary/80 group p-0 mt-4 md:mt-0">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              // Loading skeletons
              [1, 2, 3].map(i => (
                <div key={i} className="h-[500px] bg-muted animate-pulse rounded-xl" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/images/candles-collection.jpeg" 
            alt="Background" 
            className="w-full h-full object-cover grayscale mix-blend-multiply"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Candle Club
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
            Sign up for our newsletter to receive exclusive offers, early access to new scents, and candle care tips.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-colors"
            />
            <Button className="rounded-full bg-white text-primary hover:bg-white/90 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
