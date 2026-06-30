import candlesHero from "@assets/stock_images/handcrafted_candles__78dd0cf3.jpg";
import bouquetsStock from "@assets/stock_images/flower_bouquet_candl_69966b97.jpg";

export default function OurStory() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Section 1: image left, text right ── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
            <img
              src="/images/candles-hero.jpeg"
              alt="Handcrafted candles"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-normal">
              Hi! We're two sisters.
            </h2>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              We've always shared two big loves: candles and animals. One day, while scrolling through reels of animal shelters, we found ourselves asking the same question: <em>How can we help in a way that's sustainable?</em>
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              We wanted to build something that people would genuinely love while also making a meaningful, long-term impact. That's when the idea for our candle business was born.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              It all started with one test candle. From there came countless late nights experimenting with wax blends, testing fragrances, refining designs, and learning through plenty of trial and error. What began as a small passion project slowly grew into a brand that lights homes, celebrates special moments, and brings people together.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: text left, image right ── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="space-y-6 md:order-1">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-normal">
              our craft
            </h2>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              Every candle we create is still lovingly handcrafted. Each decorative candle is individually hand-poured, while our jar candles are made using <strong className="text-foreground">100% pure soy wax</strong> for a clean, beautiful burn.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              Our decorative candles are crafted from a carefully developed <strong className="text-foreground">soy and paraffin wax blend</strong>, allowing them to hold their intricate details and withstand Pakistan's warm climate without compromising on quality.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              None of it would have been possible without your support — and we are endlessly grateful.
            </p>
          </div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted md:order-2">
            <img
              src={candlesHero}
              alt="Candle making process"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: giving back ── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
            <img
              src={bouquetsStock}
              alt="Giving back to animal shelters"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-normal">
              giving back
            </h2>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              The most meaningful part of this journey is what it allows us to give back. A portion of every order goes towards supporting animal shelters — helping provide food, medical care, and shelter for animals waiting for a second chance.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              We are proud to support <strong className="text-foreground">ACF</strong> and <strong className="text-foreground">ARTS</strong>, two organisations doing incredible work to care for and rescue animals in need.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
              When you choose our candles, you're doing more than supporting a small business. You're helping us continue a mission that has been close to our hearts from the very beginning.
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing note ── */}
      <section className="bg-foreground text-background py-16 px-6 text-center mt-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="font-serif text-3xl md:text-4xl font-normal leading-snug">
            "Together, we're making homes a little warmer and the world a little kinder — one candle at a time."
          </p>
          <p className="text-background/60 text-sm mt-6 uppercase tracking-widest">candlesandcrafts</p>
        </div>
      </section>

    </div>
  );
}
