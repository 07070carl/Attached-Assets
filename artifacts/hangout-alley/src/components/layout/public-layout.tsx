import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-primary">Hangout Alley</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link>
            <Link href="/menu" className="text-sm font-medium transition-colors hover:text-primary">Menu</Link>
            <Link href="/reserve" className="text-sm font-medium transition-colors hover:text-primary">Reserve</Link>
            <Link href="/order" className="text-sm font-medium transition-colors hover:text-primary">Order Online</Link>
            <Link href="/reviews" className="text-sm font-medium transition-colors hover:text-primary">Reviews</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/order">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-muted/40 py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-serif text-xl font-semibold text-primary mb-4">Hangout Alley Siargao</p>
          <p>Dapa, Siargao Island, Philippines</p>
          <p className="mt-8">&copy; {new Date().getFullYear()} Hangout Alley. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
