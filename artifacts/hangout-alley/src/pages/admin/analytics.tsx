import { useState } from "react";
import { useGetSalesReport, useGetTopDishes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GetSalesReportPeriod } from "@workspace/api-client-react/src/generated/api.schemas";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Analytics() {
  const [period, setPeriod] = useState<GetSalesReportPeriod>("week");
  const { data: salesReport } = useGetSalesReport({ period });
  const { data: topDishes } = useGetTopDishes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Sales performance and popular items.</p>
        </div>
        <div className="w-48">
          <Select value={period} onValueChange={(val: GetSalesReportPeriod) => setPeriod(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="col-span-8 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              {salesReport && salesReport.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesReport} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(val) => {
                        if (period === 'today') return val.substring(11, 16);
                        return val.substring(5, 10);
                      }} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(val) => `₱${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₱${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available for this period.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Top Items by Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topDishes?.slice(0, 5).map((dish, i) => (
                <div key={dish.menuItemId} className="flex items-center">
                  <div className="w-8 font-bold text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium truncate">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">{dish.totalOrdered} ordered</p>
                  </div>
                  <div className="font-semibold text-sm text-primary">
                    ₱{(dish.revenue / 1000).toFixed(1)}k
                  </div>
                </div>
              ))}
              {(!topDishes || topDishes.length === 0) && (
                <div className="text-sm text-muted-foreground text-center py-4">No dish data available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
