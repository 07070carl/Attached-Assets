import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  customerPhone: z.string().min(7, "Please enter a valid phone number."),
  type: z.enum(["dine_in", "takeout"]),
  notes: z.string().optional(),
});

export function Order() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      type: "takeout",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before ordering.",
      });
      return;
    }

    createOrder.mutate(
      {
        data: {
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          type: values.type,
          notes: values.notes || null,
          items: items.map(item => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
            notes: item.notes || null
          }))
        }
      },
      {
        onSuccess: () => {
          clearCart();
          setIsSuccess(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Order Failed",
            description: "There was a problem submitting your order. Please try again.",
          });
        }
      }
    );
  }

  if (isSuccess) {
    return (
      <div className="container py-24 max-w-2xl mx-auto text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Order Received!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your order. We are preparing it now.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Place Another Order
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-primary mb-8 text-center">Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Cart Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Your cart is empty. <br/>
                  <Link href="/menu" className="text-primary hover:underline mt-2 inline-block">Browse Menu</Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.menuItem.id} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded bg-muted overflow-hidden flex-shrink-0">
                      {item.menuItem.imageUrl ? (
                        <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-foreground truncate pr-4">{item.menuItem.name}</h4>
                        <span className="font-medium whitespace-nowrap">₱{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">₱{item.menuItem.price.toFixed(2)} each</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.menuItem.id)}
                          className="text-destructive/80 hover:text-destructive text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            {items.length > 0 && (
              <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">₱{total.toFixed(2)}</span>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-md sticky top-24">
            <CardHeader>
              <CardTitle>Checkout Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Order Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md flex-1 cursor-pointer [&:has([data-state=checked])]:border-primary">
                              <FormControl>
                                <RadioGroupItem value="takeout" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">
                                Takeout
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md flex-1 cursor-pointer [&:has([data-state=checked])]:border-primary">
                              <FormControl>
                                <RadioGroupItem value="dine_in" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">
                                Dine In
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number for updates" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Special instructions..." 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg h-14"
                    disabled={items.length === 0 || createOrder.isPending}
                  >
                    {createOrder.isPending ? "Processing..." : `Place Order (₱${total.toFixed(2)})`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
