import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground uppercase tracking-wide italic mb-2">
            keep up to date
          </h2>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground uppercase tracking-wide italic mb-4">
            on the latest products
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            sign up to our newsletter and get 5% off your first order
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email here*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-foreground/30"
              data-testid="input-newsletter-email"
            />
            <Button 
              className="bg-[#555555] hover:bg-[#444444] text-white px-6"
              data-testid="button-newsletter-join"
            >
              Join
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#555555] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
            {/* Brand & Nav */}
            <div className="space-y-4">
              <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-white">candlesandcrafts</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:underline underline-offset-4">HOME</Link></li>
                <li><Link href="/about" className="hover:underline underline-offset-4">ABOUT</Link></li>
                <li><Link href="/shop" className="hover:underline underline-offset-4">SHOP</Link></li>
                <li><Link href="/contact" className="hover:underline underline-offset-4">CONTACT</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-white">contact</h3>
              <ul className="space-y-2 text-sm">
                <li>candlesandcraftss@gmail.com</li>
              </ul>
              <div className="flex gap-4 justify-center md:justify-start pt-2">
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

            {/* About Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-sans uppercase tracking-widest mb-6 text-white">about</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:underline underline-offset-4">FAQs</Link></li>
                <li><Link href="/terms" className="hover:underline underline-offset-4">TERMS</Link></li>
                <li><Link href="/policy" className="hover:underline underline-offset-4">POLICY</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20 text-center text-sm">
            <p className="opacity-80">© 2025 CandlesandCrafts.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
