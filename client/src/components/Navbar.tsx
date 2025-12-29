import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoUrl from "@assets/WhatsApp_Image_2025-12-29_at_7.27.13_PM_1767018467380.jpeg";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { data: cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { href: "/shop", label: "shop" },
    { href: "#", label: "workshop" },
    { href: "#", label: "events" },
    { href: "/our-story", label: "our story" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-secondary text-foreground text-center py-2 px-4 text-xs md:text-sm">
        our products are made to order. please allow 7-10 days for dispatch!{" "}
        <Link href="/shop" className="font-semibold hover:underline inline-flex items-center gap-1">
          shop now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src={logoUrl} alt="Candles & Crafts" className="h-16 w-16 object-contain" style={{ mixBlendMode: 'multiply' }} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              {user ? (
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-secondary">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/login'}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-secondary"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-4">
              <Link href="/cart">
                <div className="relative p-2">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <div className="flex flex-col gap-6 mt-10">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-base font-medium transition-colors ${
                          location === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="h-px bg-border my-4" />
                    {user ? (
                      <Link href="/profile" onClick={() => setIsOpen(false)} className="text-base font-medium">
                        My Account
                      </Link>
                    ) : (
                      <Button onClick={() => window.location.href = '/login'} className="w-full">
                        Sign In
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
