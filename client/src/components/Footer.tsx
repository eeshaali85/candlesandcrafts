import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-[#70734a] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="inline-block border border-white/40 rounded-full p-4">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-serif leading-none">hand poured</p>
                <h2 className="text-2xl font-serif tracking-tighter my-1">CANDLE</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] font-serif leading-none">with CARE.</p>
              </div>
            </div>
            <p className="text-sm font-serif italic opacity-80">hand poured with love</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6 lowercase">quick links</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li><Link href="/shop" className="hover:underline">shop</Link></li>
              <li><Link href="/shop?category=candles" className="hover:underline">candles</Link></li>
              <li><Link href="/shop?category=homeware" className="hover:underline">homeware</Link></li>
              <li><Link href="/shop?category=bouquet" className="hover:underline">bouquet</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-serif mb-6 lowercase">about</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
              <li><Link href="/terms" className="hover:underline">terms</Link></li>
              <li><Link href="/policy" className="hover:underline">policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <a href="#" className="hover:scale-110 transition-transform"><SiFacebook className="w-5 h-5" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><SiInstagram className="w-5 h-5" /></a>
            <a href="#" className="hover:scale-110 transition-transform"><SiWhatsapp className="w-5 h-5" /></a>
          </div>
          <p className="text-xs opacity-60">© 2025 Candle With Care.</p>
        </div>
      </div>
    </footer>
  );
}
