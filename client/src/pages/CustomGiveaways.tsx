import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import candlesStock from "@assets/stock_images/handcrafted_candles__78dd0cf3.jpg";
import luxuryGiftStock from "@assets/stock_images/luxury_custom_gift_b_d50df118.jpg";
import bouquetsStock from "@assets/stock_images/flower_bouquet_candl_69966b97.jpg";
import vesselStock from "@assets/stock_images/vessel_candle_with_f_e840b005.jpg";

const carouselImages = [
  { src: luxuryGiftStock, alt: "Luxury custom gift packaging" },
  { src: candlesStock,    alt: "Handcrafted candles collection" },
  { src: bouquetsStock,   alt: "Bouquet candles" },
  { src: vesselStock,     alt: "Vessel candles" },
];

const highlights = [
  "Minimum order: 15 candles per scent, per size",
  "Choose from 7 signature scents or request a custom blend",
  "Custom packaging, labels & branding available",
  "Charges apply for samples",
  "Delivery: 7–15 working days after order confirmation",
];

export default function CustomGiveaways() {
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const prev = () => setSlide((s) => (s - 1 + carouselImages.length) % carouselImages.length);
  const next = () => setSlide((s) => (s + 1) % carouselImages.length);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const text = `Hi! I'd like to enquire about Custom Giveaways.\n\nName: ${form.name}\nEmail: ${form.email}${form.phone ? `\nPhone: ${form.phone}` : ""}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/923379229966?text=${encodeURIComponent(text)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Text */}
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground font-normal">
              Custom Giveaways
            </h1>
            <div className="h-px w-16 bg-primary/40" />

            <p className="text-muted-foreground leading-relaxed">
              From corporate orders to personalised giveaways, Candles & Crafts has grown into a
              trusted name for handcrafted, artisan candles made with love right here in Pakistan.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We take pride in the scented experience our candles create — playing into the ambience
              of a space and crafting memories through fragrance. Every candle we make is more than
              a product; it's an experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We custom create fragrant gifts for businesses, events, weddings, and brand activations
              using our signature scent blends. Our service extends to custom packaging, branded
              labels, graphics, and print elements — so your giveaway is truly one of a kind.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Please fill in the form below for all your custom order enquiries. We'll get back to
              you as soon as possible.
            </p>

            {/* Highlights */}
            <div className="pt-2 space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Carousel */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/20">
              <img
                src={carouselImages[slide].src}
                alt={carouselImages[slide].alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>

            {/* Nav buttons */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slide ? "bg-foreground" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Form ──────────────────────────────────────────────────── */}
      <div className="bg-muted/20 border-t border-border/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground font-normal mb-2">
            Fill out the form for personalised products.
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Your enquiry will be sent directly to our team via WhatsApp for a faster response.
          </p>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">Enquiry Sent!</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Your message has been opened in WhatsApp. We'll get back to you as soon as possible.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full px-8"
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
              >
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-foreground mb-1.5">
                  Your Name <span className="text-muted-foreground">(required)</span>
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`h-12 rounded-md border-border bg-background ${errors.name ? "border-destructive" : ""}`}
                  data-testid="input-giveaway-name"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-foreground mb-1.5">
                  Your Email <span className="text-muted-foreground">(required)</span>
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`h-12 rounded-md border-border bg-background ${errors.email ? "border-destructive" : ""}`}
                  data-testid="input-giveaway-email"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-foreground mb-1.5">Your Phone Number</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-12 rounded-md border-border bg-background"
                  data-testid="input-giveaway-phone"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-1.5">
                  Your Message <span className="text-muted-foreground">(required)</span>
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your event, quantity needed, preferred scents, packaging requirements..."
                  rows={6}
                  className={`rounded-md border-border bg-background resize-none ${errors.message ? "border-destructive" : ""}`}
                  data-testid="input-giveaway-message"
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                className="h-12 px-10 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium"
                data-testid="button-giveaway-submit"
              >
                Send Enquiry
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
