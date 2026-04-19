import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, Clock, Phone, Instagram, Facebook } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reserve", label: "Reserve" },
  { href: "/order", label: "Order Online" },
  { href: "/reviews", label: "Reviews" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isHome && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-background/95 backdrop-blur-md border-border/60 shadow-sm";

  const linkColor = isHome && !scrolled ? "text-white/90 hover:text-white" : "text-foreground/70 hover:text-foreground";
  const logoColor = isHome && !scrolled ? "text-white" : "text-primary";
  const iconColor = isHome && !scrolled ? "text-white border-white/20 hover:bg-white/10" : "";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${navBg}`}>
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className={`font-serif text-2xl font-bold tracking-tight transition-colors duration-300 ${logoColor}`}>
              Hangout Alley
            </span>
            <span className={`hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-sans mt-1 transition-colors duration-300 ${isHome && !scrolled ? "text-white/50" : "text-muted-foreground"}`}>
              Siargao
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 group ${linkColor}`}
              >
                {label}
                <span className={`absolute bottom-0 left-3 right-3 h-px transition-all duration-200 scale-x-0 group-hover:scale-x-100 ${isHome && !scrolled ? "bg-white/60" : "bg-primary"}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/order">
              <Button
                variant="outline"
                size="icon"
                className={`relative transition-colors duration-300 ${iconColor}`}
              >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/reserve">
              <Button
                size="sm"
                className={`hidden sm:flex transition-all duration-300 ${isHome && !scrolled ? "bg-white text-foreground hover:bg-white/90" : "bg-primary text-primary-foreground"}`}
              >
                Book a Table
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className={`text-xs transition-colors duration-300 ${isHome && !scrolled ? "text-white/60 hover:text-white hover:bg-white/10" : ""}`}>
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page content — offset only on non-home pages */}
      <main className={`flex-1 ${!isHome ? "pt-16" : ""}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="container px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <p className="font-serif text-2xl font-bold mb-3 text-white">Hangout Alley</p>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                An island dining experience rooted in warmth, authenticity, and the flavors of Siargao.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-5 font-sans font-semibold">Explore</p>
              <ul className="space-y-3">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-5 font-sans font-semibold">Hours</p>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white/90">Monday – Sunday</p>
                    <p>11:00 AM – 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-5 font-sans font-semibold">Visit Us</p>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Dapa, Siargao Island<br />Surigao del Norte, Philippines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>+63 912 345 6789</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Hangout Alley Siargao. All rights reserved.
            </p>
            <p className="text-xs text-white/30 italic font-serif">
              "The taste of Siargao, one plate at a time."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
