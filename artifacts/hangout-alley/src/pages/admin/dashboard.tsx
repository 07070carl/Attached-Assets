import { useGetDashboardSummary, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, Package, ShoppingBag, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

export function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const { data: recentActivity } = useGetRecentActivity();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening at Hangout Alley today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
            <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{summary?.todayRevenue?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{((summary?.todayRevenue || 0) / (summary?.weeklyRevenue || 1) * 100).toFixed(1)}% from weekly average
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <div className="h-8 w-8 bg-blue-500/10 rounded flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.todayOrders || 0} total orders today
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservations</CardTitle>
            <div className="h-8 w-8 bg-amber-500/10 rounded flex items-center justify-center">
              <Users className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.activeReservations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Seated or expected today
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <div className="h-8 w-8 bg-destructive/10 rounded flex items-center justify-center">
              <Package className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.lowStockCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items need reordering
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-none bg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity?.length ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === 'order' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {activity.type === 'order' ? <ShoppingBag className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span className="font-semibold text-foreground/80">{activity.customerName}</span>
                        <span>•</span>
                        <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {format(new Date(activity.timestamp), 'h:mm a')}</span>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-sm font-bold">
                        ₱{activity.amount.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-none bg-card">
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {summary?.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="flex gap-1 mb-2 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-6 h-6 ${i < Math.round(summary?.averageRating || 0) ? 'fill-current' : 'text-muted fill-current opacity-30'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Based on {summary?.totalReviews || 0} reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
