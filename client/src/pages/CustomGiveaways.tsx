import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const carouselImages = [
  { src: "/images/giveaway-statelife-jars.jpg",     alt: "Custom branded candle jars for State Life" },
  { src: "/images/giveaway-statelife-boxes.jpg",    alt: "State Life gift boxes with pink ribbons" },
  { src: "/images/giveaway-wedding-jars.jpg",       alt: "Personalised wedding favour candles" },
  { src: "/images/giveaway-nobelcasa-boxes2.jpg",   alt: "Nobel Casa Group custom gift boxes" },
  { src: "/images/giveaway-nobelcasa-candles.jpg",  alt: "Nobel Casa branded candles" },
  { src: "/images/giveaway-bubble-candles.jpg",     alt: "Bubble candles with dried flowers" },
  { src: "/images/giveaway-IMG_5394_1782340279008-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_7560_1782340279008-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_4621_1782340279009-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_6584_1782340279011-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_9279_1782340279014-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_9019_1782340279015-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_8541_1782340279016-opt.jpg", alt: "Custom giveaway candles" },
  { src: "/images/giveaway-IMG_9488_1782340279017-opt.jpg", alt: "Custom giveaway candles" },
].filter(img => img.src);

const highlights = [
  "Minimum order: 15 candles per scent, per size",
  "Choose from 7 signature scents or request a custom blend",
  "Custom packaging, labels & branding available",
  "Charges apply for samples",
  "Delivery: Depends on order",
];

const collaborators = [
  {
    name: "State Life Insurance Corporation of Pakistan",
    domain: "statelife.com.pk",
    short: "STATE LIFE",
    style: "text-[12px] font-black uppercase tracking-[0.18em] text-foreground/70 max-w-[90px] text-center",
  },
  {
    name: "LUMS University",
    domain: "lums.edu.pk",
    short: "LUMS",
    style: "text-[22px] font-black uppercase tracking-[0.05em] text-foreground/75",
  },
  {
    name: "MyHCM",
    domain: "myhcm.com",
    short: "MyHCM",
    style: "text-[18px] font-bold tracking-tight text-foreground/70 italic",
  },
  {
    name: "Dawood Public School",
    domain: "dawoodpublicschool.edu.pk",
    short: "DAWOOD\nPUBLIC SCHOOL",
    style: "text-[11px] font-black uppercase tracking-[0.14em] text-foreground/70 text-center whitespace-pre-line",
  },
  {
    name: "Nobel Casa Group",
    domain: "nobelcasa.com.pk",
    short: "NOBEL CASA\nGROUP",
    style: "text-[11px] font-black uppercase tracking-[0.18em] text-foreground/70 text-center whitespace-pre-line",
  },
];

function CollabLogo({ domain, name, short, style }: { domain: string; name: string; short: string; style?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={`text-center leading-snug select-none ${style ?? "text-[13px] font-black uppercase tracking-[0.12em] text-foreground/75"}`}>
        {short}
      </span>
    );
  }
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      className="h-9 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
      onError={() => setFailed(true)}
    />
  );
}

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
              From thoughtfully curated collections to bespoke creations, Candles & Crafts has been
              quietly transforming everyday spaces into meaningful experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At Candles & Crafts, we believe a candle is more than just wax and wick, it's a
              feeling, a moment, a memory in the making. Each piece is carefully handcrafted to bring
              warmth, calm, and character into your surroundings.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our scents are designed to do more than simply linger, they create an atmosphere,
              elevate moods, and leave a lasting impression long after the flame is gone.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With a focus on detail and creativity, we work closely with our clients to craft
              personalized candles for events, gifting, and brand collaborations, ensuring every
              piece feels intentional and unique.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From concept to creation, we also offer support in packaging, design, branded labels
              and presentation, because every detail matters.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For custom orders and collaborations, we'd love to hear from you. Please fill in the
              form below for your custom order enquiries or DM us on Instagram for urgent custom
              orders.
            </p>

            {/* Highlights */}
            <div className="pt-2 space-y-2.5">
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
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
              <img
                src={carouselImages[slide].src}
                alt={carouselImages[slide].alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
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

      {/* ── Collaborations Strip ──────────────────────────────────────────── */}
      <div className="bg-white border-t border-border/30 border-b border-border/30 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-base font-bold text-black mb-12 tracking-wide">
            Collaborations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
            {collaborators.map((c, i) => (
              <div key={i} className="flex items-center justify-center min-w-[110px]">
                <CollabLogo domain={c.domain} name={c.name} short={c.short} style={c.style} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact Form ──────────────────────────────────────────────────── */}
      <div className="bg-muted/20">
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
