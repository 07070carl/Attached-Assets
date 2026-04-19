import { useState } from "react";
import { useGetReservations, useUpdateReservationStatus } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { getGetReservationsQueryKey } from "@workspace/api-client-react";
import { UpdateReservationStatusBodyStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { CalendarIcon, Users, Phone } from "lucide-react";
import {
  Table,
  Body,
  Cell,
  Head,
  Header,
  Row,
} from "@/components/ui/table"; // Assuming standard table, will use simple div/table if not fully featured in ui

export function Reservations() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: reservations } = useGetReservations(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const updateStatus = useUpdateReservationStatus();
  const queryClient = useQueryClient();

  const handleStatusChange = (id: number, newStatus: UpdateReservationStatusBodyStatus) => {
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetReservationsQueryKey() });
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "confirmed": return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Confirmed</Badge>;
      case "seated": return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Seated</Badge>;
      case "completed": return <Badge variant="secondary" className="opacity-70">Completed</Badge>;
      case "no_show": return <Badge variant="destructive" className="opacity-70">No Show</Badge>;
      case "cancelled": return <Badge variant="destructive" className="opacity-70">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">Manage table bookings and guest seating.</p>
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
              <SelectItem value="seated">Seated</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardContent className="p-0">
          <div className="rounded-md border-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Party Size</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reservations?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No reservations found.
                    </td>
                  </tr>
                )}
                {reservations?.map((res) => (
                  <tr key={res.id} className="bg-card hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{res.customerName}</div>
                      <div className="text-muted-foreground text-xs flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" /> {res.customerPhone}
                      </div>
                      {res.notes && <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px] italic">"{res.notes}"</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{format(new Date(res.reservationDate), 'MMM d, yyyy')}</div>
                          <div className="text-muted-foreground">{res.reservationTime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {res.partySize} pax
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {res.status === 'pending' && (
                          <Button size="sm" onClick={() => handleStatusChange(res.id, 'confirmed')}>Confirm</Button>
                        )}
                        {res.status === 'confirmed' && (
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusChange(res.id, 'seated')}>Seat Guest</Button>
                        )}
                        {res.status === 'seated' && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(res.id, 'completed')}>Complete</Button>
                        )}
                        {(res.status === 'pending' || res.status === 'confirmed') && (
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleStatusChange(res.id, 'cancelled')}>Cancel</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
