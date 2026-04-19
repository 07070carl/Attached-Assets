import { useState } from "react";
import { useGetOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getGetOrdersQueryKey } from "@workspace/api-client-react";
import { OrderStatus, UpdateOrderStatusBodyStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { Clock, ShoppingBag } from "lucide-react";

export function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: orders } = useGetOrders(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const updateStatus = useUpdateOrderStatus();
  const queryClient = useQueryClient();

  const handleStatusChange = (orderId: number, newStatus: UpdateOrderStatusBodyStatus) => {
    updateStatus.mutate(
      { id: orderId, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "confirmed": return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case "preparing": return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Preparing</Badge>;
      case "ready": return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>;
      case "completed": return <Badge variant="default" className="bg-gray-200 text-gray-800 hover:bg-gray-200 border-none">Completed</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Track and manage active kitchen orders.</p>
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders?.map((order) => (
          <Card key={order.id} className="border-none shadow-sm bg-card overflow-hidden flex flex-col">
            <div className={`h-2 w-full ${
              order.status === 'pending' ? 'bg-yellow-400' :
              order.status === 'preparing' ? 'bg-purple-400' :
              order.status === 'ready' ? 'bg-green-400' : 'bg-muted'
            }`} />
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">#{order.id} {order.customerName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="font-normal">{order.type === 'dine_in' ? 'Dine In' : 'Takeout'}</Badge>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {format(new Date(order.createdAt), 'h:mm a')}</span>
                  </div>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="bg-muted/30 rounded-md p-3 mb-4 flex-1">
                <ul className="space-y-2 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span className="font-medium">{item.quantity}x {item.menuItemName}</span>
                      <span className="text-muted-foreground">₱{item.subtotal.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                {order.notes && (
                  <div className="mt-3 pt-3 border-t border-border/50 text-xs italic text-muted-foreground">
                    Note: {order.notes}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t">
                <div className="font-bold text-lg text-primary">₱{order.totalAmount.toFixed(2)}</div>
                
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button size="sm" onClick={() => handleStatusChange(order.id, 'confirmed')}>Confirm</Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button size="sm" onClick={() => handleStatusChange(order.id, 'preparing')}>Start Prep</Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(order.id, 'ready')}>Mark Ready</Button>
                  )}
                  {order.status === 'ready' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, 'completed')}>Complete</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders?.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
            <p>No orders found matching the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
