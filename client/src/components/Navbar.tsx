import { Link, useLocation } from "wouter";
import { ShoppingBag, User, Menu, X, Flame, ChevronDown } from "lucide-react";
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

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { data: cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const links = [
    { href: "/", label: "Our Story" },
  ];

  const shopCategories = [
    { href: "/", label: "All Products" },
    { href: "/?category=jar-candles", label: "Jar Candles" },
    { href: "/?category=pillar-candles", label: "Pillar Candles" },
    { href: "/?category=bouquets", label: "Bouquets" },
    { href: "/?category=gift-sets", label: "Gift Sets" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold text-primary tracking-tight">
              Candles<span className="font-hand text-foreground font-normal mx-1">&</span>Crafts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Shop Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex items-center gap-1">
                  Shop
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {shopCategories.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => window.location.href = '/login'}
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart">
              <div className="relative p-2">
                <ShoppingBag className="w-6 h-6 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-10">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-primary mb-3">Shop</h3>
                    <div className="flex flex-col gap-2">
                      {shopCategories.map((item) => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base text-foreground hover:text-primary transition-colors pl-2"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {links.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-serif text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-4" />
                  {user ? (
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="text-xl font-medium">
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
  );
}
