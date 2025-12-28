import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-foreground bg-background">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">Candles & Crafts</h2>
          <p className="opacity-60 mb-8">Illuminating moments, crafting memories.</p>
          <div className="flex justify-center gap-6 mb-8 text-sm opacity-80">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-xs opacity-40">© {new Date().getFullYear()} Candles & Crafts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
