import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import OurStory from "@/pages/OurStory";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";
import CustomGiveaways from "@/pages/CustomGiveaways";
import Admin from "@/pages/Admin";

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-foreground bg-background">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Switch>
          <Route path="/">
            {() => <Home />}
          </Route>
          <Route path="/shop" component={Shop} />
          <Route path="/our-story" component={OurStory} />
          <Route path="/product/candle/:slug" component={ProductDetail} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/profile" component={Profile} />
          <Route path="/giveaways" component={CustomGiveaways} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdmin && <Footer />}
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
