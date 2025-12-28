export default function OurStory() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">Our Story</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover the passion and craftsmanship behind CandlesandCrafts
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">Our Journey</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              CandlesandCrafts was born from a simple passion: creating beautiful, handcrafted candles that bring warmth and ambiance to every space. What started as a small hobby has blossomed into a thriving business dedicated to quality, sustainability, and the art of scent.
            </p>
            
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground mt-12">Our Craft</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Every candle is hand-poured with care using 100% pure soy wax and clean fragrances. We believe in the power of natural ingredients and sustainable practices. Our team carefully selects each scent to create an unforgettable sensory experience that transforms your home.
            </p>

            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground mt-12">Our Values</h2>
            <ul className="space-y-4 text-foreground/80">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Quality:</strong> We never compromise on the quality of our ingredients or craftsmanship.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Sustainability:</strong> Eco-friendly materials and practices are at the heart of what we do.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Artistry:</strong> Each candle is a work of art, crafted with love and attention to detail.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Community:</strong> We believe in building meaningful connections with our customers.</span>
              </li>
            </ul>

            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground mt-12">Thank You</h2>
            <p className="text-foreground/80 leading-relaxed">
              We're grateful for every person who chooses CandlesandCrafts. Your support allows us to continue creating beautiful candles and spreading light, warmth, and joy to homes everywhere. Thank you for being part of our journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
