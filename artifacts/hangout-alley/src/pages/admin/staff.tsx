import { useState } from "react";
import { useGetStaff, useCreateStaffMember, useUpdateStaffMember, useDeleteStaffMember, getGetStaffQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Mail, Phone } from "lucide-react";

const staffSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  shift: z.string().optional(),
  isActive: z.boolean().default(true),
});

export function Staff() {
  const { data: staff } = useGetStaff();
  const createStaff = useCreateStaffMember();
  const updateStaff = useUpdateStaffMember();
  const deleteStaff = useDeleteStaffMember();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      role: "",
      phone: "",
      email: "",
      shift: "",
      isActive: true,
    },
  });

  const openDialog = (member?: any) => {
    if (member) {
      setEditingId(member.id);
      form.reset({
        name: member.name,
        role: member.role,
        phone: member.phone || "",
        email: member.email || "",
        shift: member.shift || "",
        isActive: member.isActive,
      });
    } else {
      setEditingId(null);
      form.reset({
        name: "",
        role: "",
        phone: "",
        email: "",
        shift: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof staffSchema>) => {
    const data = {
      name: values.name,
      role: values.role,
      phone: values.phone || null,
      email: values.email || null,
      shift: values.shift || null,
      isActive: values.isActive,
    };

    if (editingId) {
      updateStaff.mutate({ id: editingId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetStaffQueryKey() });
          toast({ title: "Staff member updated" });
          setIsDialogOpen(false);
        }
      });
    } else {
      createStaff.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetStaffQueryKey() });
          toast({ title: "Staff member added" });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this staff member?")) {
      deleteStaff.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetStaffQueryKey() });
          toast({ title: "Staff member removed" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your restaurant team.</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff?.map((member) => (
          <Card key={member.id} className={`border-none shadow-sm ${!member.isActive ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg font-serif">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                {member.phone && (
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {member.phone}</div>
                )}
                {member.email && (
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {member.email}</div>
                )}
                {member.shift && (
                  <div className="flex items-center gap-2">Shift: {member.shift}</div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openDialog(member)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(member.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl><Input placeholder="e.g. Waiter, Chef" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typical Shift</FormLabel>
                    <FormControl><Input placeholder="e.g. Morning, Evening, Weekends" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Active employee</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-4" disabled={createStaff.isPending || updateStaff.isPending}>
                {editingId ? "Update Staff" : "Add Staff"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
