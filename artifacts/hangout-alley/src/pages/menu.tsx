import { useState } from "react";
import { useGetMenuItems, useGetCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Plus } from "lucide-react";

export function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = useGetCategories();
  const { data: menuItems } = useGetMenuItems({
    categoryId: selectedCategory,
    available: true,
  });
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem(item);
    toast({ title: "Added to order", description: `${item.name} added to your order.` });
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Page Header */}
      <div className="relative bg-foreground text-background py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/lumpiang-shanghai.png" alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="relative z-10 container px-4 md:px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">Hangout Alley</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">Our Menu</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Authentic island flavors, prepared fresh daily with local ingredients.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 py-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
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
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
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

      {/* Menu Grid */}
      <div className="flex-1 py-14 bg-background">
        <div className="container px-4 md:px-6">
          {menuItems && menuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground/40 text-xs">No photo yet</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-white text-zinc-900 rounded-full w-12 h-12 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {item.isFeatured && (
                        <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Signature
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif font-bold text-base leading-snug text-foreground">{item.name}</h3>
                      <span className="font-semibold text-primary text-sm whitespace-nowrap mt-0.5">
                        ₱{Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    {item.allergens && (
                      <p className="text-[10px] text-muted-foreground/60 italic mb-3">Contains: {item.allergens}</p>
                    )}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-28 text-muted-foreground">
              <p className="font-serif text-2xl mb-2">No dishes found</p>
              <p className="text-sm">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
