import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, Clock, Phone, Instagram, Facebook, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/",       label: "Home" },
  { href: "/menu",   label: "Menu" },
  { href: "/reserve",label: "Reserve" },
  { href: "/order",  label: "Order Online" },
  { href: "/reviews",label: "Reviews" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const [location] = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  const navBg      = transparent ? "bg-transparent border-transparent" : "bg-background/95 backdrop-blur-md border-border/60 shadow-sm";
  const linkColor  = transparent ? "text-white/85 hover:text-white"    : "text-foreground/70 hover:text-foreground";
  const iconBorder = transparent ? "border-white/20 hover:bg-white/10 text-white" : "";
  const hamburger  = transparent ? "text-white hover:bg-white/10"        : "text-foreground hover:bg-muted";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">

      {/* ── Navigation ─────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${navBg}`}>
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center w-10 h-10 shadow-md">
              <img
                src="/images/logo.png"
                alt="Hangout Alley Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className={`font-serif text-xl font-bold tracking-tight transition-colors duration-300 ${transparent ? "text-white" : "text-primary"}`}>
                Hangout Alley
              </span>
              <span className={`text-[10px] uppercase tracking-[0.18em] font-sans transition-colors duration-300 ${transparent ? "text-white/45" : "text-muted-foreground"}`}>
                Siargao
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 group ${linkColor}`}
              >
                {label}
                <span className={`absolute bottom-0 left-3 right-3 h-px transition-all duration-200 scale-x-0 group-hover:scale-x-100 origin-left ${transparent ? "bg-white/60" : "bg-accent"}`} />
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/order">
              <Button variant="outline" size="icon" className={`relative transition-colors duration-300 ${iconBorder}`}>
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Book a Table — desktop only */}
            <Link href="/reserve" className="hidden sm:block">
              <Button size="sm" className={`transition-all duration-300 ${transparent ? "bg-white text-zinc-900 hover:bg-white/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                Book a Table
              </Button>
            </Link>

            {/* Admin link — desktop */}
            <Link href="/admin" className="hidden md:block">
              <Button variant="ghost" size="sm" className={`text-xs transition-colors duration-300 ${transparent ? "text-white/50 hover:text-white hover:bg-white/10" : ""}`}>
                Admin
              </Button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`md:hidden rounded-lg p-2 transition-colors duration-200 ${hamburger}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ────────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-350 ease-in-out ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
          style={{ background: "hsl(var(--background))", borderTop: mobileOpen ? "1px solid hsl(var(--border))" : "none" }}
        >
          <nav className="container px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border flex gap-2">
              <Link href="/reserve" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground rounded-xl">Book a Table</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="rounded-xl">Admin</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────── */}
      <main className={`flex-1 ${!isHome ? "pt-16" : ""}`}>
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-zinc-950 text-white">
        <div className="container px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-white leading-none">Hangout Alley</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mt-0.5">Siargao</p>
                </div>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-5">
                An island dining experience rooted in warmth, authenticity, and the flavors of Siargao.
              </p>
              <div className="flex gap-3">
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4 font-semibold">Explore</p>
              <ul className="space-y-3">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4 font-semibold">Hours</p>
              <div className="flex items-start gap-2 text-sm text-white/50">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <div>
                  <p className="text-white/80">Monday – Sunday</p>
                  <p>11:00 AM – 10:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4 font-semibold">Visit Us</p>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                  <span>Dapa, Siargao Island<br />Surigao del Norte, Philippines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-accent" />
                  <span>+63 912 345 6789</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} Hangout Alley Siargao. All rights reserved.
            </p>
            <p className="text-xs text-white/25 italic font-serif">
              "The taste of Siargao, one plate at a time."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
