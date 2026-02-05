import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-[#a08060] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
          {/* Brand & Nav */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif uppercase tracking-widest mb-6">candlesandcrafts</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline underline-offset-4">HOME</Link></li>
              <li><Link href="/about" className="hover:underline underline-offset-4">ABOUT</Link></li>
              <li><Link href="/shop" className="hover:underline underline-offset-4">SHOP</Link></li>
              <li><Link href="/contact" className="hover:underline underline-offset-4">CONTACT</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif uppercase tracking-widest mb-6">contact</h3>
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
            <h3 className="text-lg font-serif uppercase tracking-widest mb-6">about</h3>
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
  );
}
