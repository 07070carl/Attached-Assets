import { useState } from "react";
import { useGetMenuItems, useGetCategories } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";

export function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = useGetCategories();
  const { data: menuItems } = useGetMenuItems({ 
    categoryId: selectedCategory,
    available: true
  });
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem(item);
    toast({
      title: "Added to order",
      description: `${item.name} has been added to your order.`
    });
  };

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Our Menu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our authentic island flavors, prepared fresh daily with local ingredients.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full"
        >
          All Items
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems?.map((item) => (
          <Card key={item.id} className="overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-all">
            <div className="aspect-[4/3] bg-muted relative">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Image coming soon
                </div>
              )}
              {item.isFeatured && (
                <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                  Signature
                </div>
              )}
            </div>
            <CardContent className="p-5 flex flex-col justify-between h-[180px]">
              <div>
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-serif font-bold text-lg leading-tight">{item.name}</h3>
                  <span className="font-semibold text-primary whitespace-nowrap">₱{item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                {item.allergens && (
                  <p className="text-xs text-muted-foreground/80 italic">Contains: {item.allergens}</p>
                )}
              </div>
              <Button 
                onClick={() => handleAddToCart(item)}
                variant="secondary"
                className="w-full mt-4 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems?.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          No menu items found for this category.
        </div>
      )}
    </div>
  );
}
