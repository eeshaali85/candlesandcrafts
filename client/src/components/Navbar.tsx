import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, ArrowRight, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoUrl from "@assets/image_1767822379454.png";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { data: cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const shopCategories = [
    { label: "all candles", href: "/shop" },
    { label: "jar candles", href: "/shop?category=jar" },
    { label: "bouquet candles", href: "/shop?category=bouquet" },
    { label: "decorative candles", href: "/shop?category=decorative" },
    { label: "gift sets", href: "/shop?category=gift-sets" },
    { label: "ceramics", href: "/shop?category=ceramics" },
  ];

  const navLinks = [
    { href: "#", label: "workshop" },
    { href: "/giveaways", label: "custom giveaways" },
    { label: "our story", href: "/our-story" },
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
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src={logoUrl} alt="Candles & Crafts" className="h-24 w-24 object-contain" style={{ mixBlendMode: 'multiply' }} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div 
                className="relative group"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <DropdownMenu open={isShopOpen} onOpenChange={setIsShopOpen}>
                  <DropdownMenuTrigger className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1 outline-none">
                    shop <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-48"
                    onMouseEnter={() => setIsShopOpen(true)}
                    onMouseLeave={() => setIsShopOpen(false)}
                  >
                    {shopCategories.map((category) => (
                      <DropdownMenuItem key={category.href} asChild>
                        <Link href={category.href} className="w-full lowercase cursor-pointer">
                          {category.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Search className="w-5 h-5" data-testid="button-search" />
              </Button>

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
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">shop</p>
                      <div className="flex flex-col gap-3 pl-2">
                        {shopCategories.map((category) => (
                          <Link 
                            key={category.href}
                            href={category.href}
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground lowercase"
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border my-2" />

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
