import { useState } from "react";
import { 
  useGetMenuItems, 
  useCreateMenuItem, 
  useUpdateMenuItem, 
  useDeleteMenuItem,
  useGetCategories,
  getGetMenuItemsQueryKey,
  getGetCategoriesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const menuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  categoryId: z.coerce.number().nullable().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  allergens: z.string().optional(),
});

export function AdminMenu() {
  const { data: menuItems } = useGetMenuItems();
  const { data: categories } = useGetCategories();
  
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editingMenuItemId, setEditingMenuItemId] = useState<number | null>(null);

  const menuForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: undefined,
      imageUrl: "",
      isAvailable: true,
      isFeatured: false,
      allergens: "",
    },
  });

  const openMenuDialog = (item?: any) => {
    if (item) {
      setEditingMenuItemId(item.id);
      menuForm.reset({
        name: item.name,
        description: item.description || "",
        price: item.price,
        categoryId: item.categoryId || undefined,
        imageUrl: item.imageUrl || "",
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
        allergens: item.allergens || "",
      });
    } else {
      setEditingMenuItemId(null);
      menuForm.reset({
        name: "",
        description: "",
        price: 0,
        categoryId: categories?.[0]?.id || undefined,
        imageUrl: "",
        isAvailable: true,
        isFeatured: false,
        allergens: "",
      });
    }
    setIsMenuDialogOpen(true);
  };

  const onSubmitMenu = (values: z.infer<typeof menuItemSchema>) => {
    const data = {
      name: values.name,
      description: values.description || null,
      price: values.price,
      categoryId: values.categoryId || null,
      imageUrl: values.imageUrl || null,
      isAvailable: values.isAvailable,
      isFeatured: values.isFeatured,
      allergens: values.allergens || null,
    };

    if (editingMenuItemId) {
      updateMenuItem.mutate({ id: editingMenuItemId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });
          toast({ title: "Menu item updated" });
          setIsMenuDialogOpen(false);
        }
      });
    } else {
      createMenuItem.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });
          toast({ title: "Menu item created" });
          setIsMenuDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteMenu = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMenuItem.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });
          toast({ title: "Menu item deleted" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your dishes and categories.</p>
        </div>
        <Button onClick={() => openMenuDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {menuItems?.map((item) => (
                <tr key={item.id} className="bg-card hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-muted-foreground text-xs truncate max-w-xs">{item.description}</div>
                  </td>
                  <td className="px-6 py-4">{item.categoryName || "-"}</td>
                  <td className="px-6 py-4 font-medium">₱{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {item.isAvailable ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Unavailable</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openMenuDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteMenu(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingMenuItemId ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <Form {...menuForm}>
            <form onSubmit={menuForm.handleSubmit(onSubmitMenu)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={menuForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₱)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={menuForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(val ? Number(val) : null)} 
                        value={field.value ? String(field.value) : undefined}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={menuForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea className="resize-none" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-6 pt-2">
                <FormField
                  control={menuForm.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Available for order</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuForm.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Featured on home page</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={createMenuItem.isPending || updateMenuItem.isPending}>
                {editingMenuItemId ? "Update Item" : "Create Item"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
