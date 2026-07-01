import { Link } from "wouter";
import { SiInstagram } from "react-icons/si";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubscribe() {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-12">
          {/* Brand & Nav */}
          <div className="space-y-4">
            <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-background">candlesandcrafts</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline underline-offset-4 uppercase">Home</Link></li>
              <li><Link href="/shop" className="hover:underline underline-offset-4 uppercase">Shop</Link></li>
              <li><Link href="/our-story" className="hover:underline underline-offset-4 uppercase">Our Story</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-background">contact</h3>
            <ul className="space-y-2 text-sm">
              <li>candlesandcraftss@gmail.com</li>
            </ul>
            <div className="flex gap-4 justify-center pt-2">
              <a href="https://www.instagram.com/candlesandcraftspk/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" data-testid="link-instagram">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="mailto:candlesandcraftss@gmail.com" className="hover:opacity-80 transition-opacity" data-testid="link-email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-background">newsletter</h3>
            <p className="text-sm opacity-80 mb-4">Subscribe to our newsletter</p>
            {status === "done" ? (
              <p className="text-sm text-background/80">Thank you for subscribing! 🕯️</p>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email here*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="bg-transparent border-background/50 text-background placeholder:text-background/60"
                  data-testid="input-footer-newsletter-email"
                />
                <Button
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                  className="w-full bg-background/20 hover:bg-background/30 text-background border border-background/50"
                  data-testid="button-footer-newsletter-join"
                >
                  {status === "loading" ? "Sending..." : "Join"}
                </Button>
                {status === "error" && (
                  <p className="text-xs text-red-300">Something went wrong. Please try again.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20 text-center text-sm">
          <p className="opacity-80">© 2025 CandlesandCrafts.</p>
        </div>
      </div>
    </footer>
  );
}
