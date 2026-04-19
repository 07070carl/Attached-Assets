import { useState } from "react";
import { useGetInventory, useCreateInventoryItem, useUpdateInventoryItem, getGetInventoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Plus, AlertTriangle } from "lucide-react";

const inventorySchema = z.object({
  name: z.string().min(2),
  unit: z.string().min(1),
  currentStock: z.coerce.number().min(0),
  reorderLevel: z.coerce.number().min(0),
  costPerUnit: z.coerce.number().min(0).optional(),
  supplier: z.string().optional(),
});

export function Inventory() {
  const { data: inventory } = useGetInventory();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      unit: "pcs",
      currentStock: 0,
      reorderLevel: 10,
      costPerUnit: 0,
      supplier: "",
    },
  });

  const openDialog = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      form.reset({
        name: item.name,
        unit: item.unit,
        currentStock: item.currentStock,
        reorderLevel: item.reorderLevel,
        costPerUnit: item.costPerUnit || 0,
        supplier: item.supplier || "",
      });
    } else {
      setEditingId(null);
      form.reset({
        name: "",
        unit: "kg",
        currentStock: 0,
        reorderLevel: 5,
        costPerUnit: 0,
        supplier: "",
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof inventorySchema>) => {
    const data = {
      name: values.name,
      unit: values.unit,
      currentStock: values.currentStock,
      reorderLevel: values.reorderLevel,
      costPerUnit: values.costPerUnit || null,
      supplier: values.supplier || null,
    };

    if (editingId) {
      updateItem.mutate({ id: editingId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
          toast({ title: "Inventory updated" });
          setIsDialogOpen(false);
        }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
          toast({ title: "Item added to inventory" });
          setIsDialogOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Track ingredients and supplies.</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Reorder Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventory?.map((item) => {
                const isLow = item.currentStock <= item.reorderLevel;
                return (
                  <tr key={item.id} className="bg-card hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className={`px-6 py-4 font-bold ${isLow ? 'text-destructive' : ''}`}>
                      {item.currentStock}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.unit}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.reorderLevel}</td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="flex items-center text-xs text-destructive font-medium bg-destructive/10 px-2 py-1 rounded-full w-fit">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-xs text-green-700 font-medium bg-green-100 px-2 py-1 rounded-full w-fit">Healthy</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl><Input placeholder="kg, pcs, L" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reorderLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder At</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costPerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Unit (₱)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={createItem.isPending || updateItem.isPending}>
                {editingId ? "Update Item" : "Add Item"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
