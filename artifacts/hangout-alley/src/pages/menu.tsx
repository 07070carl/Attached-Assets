import { useState } from "react";
import { useGetMenuItems, useGetCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Plus } from "lucide-react";
import { AnimateIn } from "@/components/animate-in";

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";

export function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = useGetCategories();
  const { data: menuItems } = useGetMenuItems({ categoryId: selectedCategory, available: true });
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem(item);
    toast({ title: "Added to order", description: `${item.name} added to your order.` });
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Page Header ── */}
      <div className="relative bg-foreground text-background py-20 overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ animation: "ha-blur-in 1.4s ease 0ms both" }}
        >
          <img src="/images/lumpiang-shanghai.png" alt="" className="w-full h-full object-cover object-center" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 text-center">
          <p
            className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-3"
            style={{ animation: `ha-fade-up 700ms ${SPRING} 100ms both` }}
          >
            Hangout Alley
          </p>
          <h1
            className="font-serif text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ animation: `ha-fade-up 800ms ${SPRING} 220ms both` }}
          >
            Our Menu
          </h1>
          <p
            className="text-white/50 text-lg max-w-xl mx-auto"
            style={{ animation: `ha-fade-up 700ms ${SPRING} 360ms both` }}
          >
            Authentic island flavors, prepared fresh daily with local ingredients.
          </p>
        </div>
      </div>

      {/* ── Sticky Category Filter ── */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 py-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border hover:scale-105 active:scale-95 ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-transparent text-foreground/60 border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              All Items
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border hover:scale-105 active:scale-95 ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-transparent text-foreground/60 border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Menu Grid ── */}
      <div className="flex-1 py-14 bg-background">
        <div className="container px-4 md:px-6">
          {menuItems && menuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {menuItems.map((item, idx) => (
                <AnimateIn
                  key={item.id}
                  animation="fade-up"
                  delay={Math.min(idx, 11) * 55}
                  duration={700}
                  threshold={0.05}
                >
                  <div className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400 h-full">

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full shimmer-bg" />
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/35 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-white text-zinc-900 rounded-full w-12 h-12 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {item.isFeatured && (
                        <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Signature
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col h-[168px]">
                      <div className="flex items-start justify-between gap-2 mb-1.5 flex-1">
                        <h3 className="font-serif font-bold text-base leading-snug text-foreground">{item.name}</h3>
                        <span className="font-semibold text-primary text-sm whitespace-nowrap mt-0.5">
                          ₱{Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>
                      {item.allergens && (
                        <p className="text-[10px] text-muted-foreground/60 italic mb-2">Contains: {item.allergens}</p>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="mt-auto w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Order
                      </button>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          ) : (
            <AnimateIn animation="fade-in" duration={500} threshold={0.1}>
              <div className="text-center py-28 text-muted-foreground">
                <p className="font-serif text-2xl mb-2">No dishes found</p>
                <p className="text-sm">Try selecting a different category.</p>
              </div>
            </AnimateIn>
          )}
        </div>
      </div>
    </div>
  );
}
