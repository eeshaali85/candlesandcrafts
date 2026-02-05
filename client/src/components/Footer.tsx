import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-12">
          {/* Brand & Nav */}
          <div className="space-y-4">
            <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-background">candlesandcrafts</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline underline-offset-4">HOME</Link></li>
              <li><Link href="/about" className="hover:underline underline-offset-4">ABOUT</Link></li>
              <li><Link href="/shop" className="hover:underline underline-offset-4">SHOP</Link></li>
              <li><Link href="/contact" className="hover:underline underline-offset-4">CONTACT</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-background">contact</h3>
            <ul className="space-y-2 text-sm">
              <li>candlesandcraftss@gmail.com</li>
            </ul>
            <div className="flex gap-4 justify-center pt-2">
              <a href="#" className="hover:opacity-80 transition-opacity" data-testid="link-facebook">
                <SiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" data-testid="link-instagram">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" data-testid="link-whatsapp">
                <SiWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-background">newsletter</h3>
            <p className="text-sm opacity-80 mb-4">5% off your first order when you sign up</p>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Enter your email here*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-background/50 text-background placeholder:text-background/60"
                data-testid="input-footer-newsletter-email"
              />
              <Button 
                className="w-full bg-background/20 hover:bg-background/30 text-background border border-background/50"
                data-testid="button-footer-newsletter-join"
              >
                Join
              </Button>
            </div>
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
