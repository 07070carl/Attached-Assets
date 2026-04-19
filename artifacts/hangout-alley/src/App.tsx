import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/hooks/use-cart";

// Layouts
import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLayout } from "@/components/layout/admin-layout";

// Public Pages
import { Home } from "@/pages/home";
import { Menu } from "@/pages/menu";
import { Reserve } from "@/pages/reserve";
import { Order } from "@/pages/order";
import { Reviews } from "@/pages/reviews";

// Admin Pages
import { Dashboard } from "@/pages/admin/dashboard";
import { Orders } from "@/pages/admin/orders";
import { Reservations } from "@/pages/admin/reservations";
import { AdminMenu } from "@/pages/admin/menu";
import { Inventory } from "@/pages/admin/inventory";
import { Staff } from "@/pages/admin/staff";
import { AdminReviews } from "@/pages/admin/reviews";
import { Analytics } from "@/pages/admin/analytics";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/orders" component={Orders} />
            <Route path="/reservations" component={Reservations} />
            <Route path="/menu" component={AdminMenu} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/staff" component={Staff} />
            <Route path="/reviews" component={AdminReviews} />
            <Route path="/analytics" component={Analytics} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      {/* Public Routes */}
      <Route path="/" nest>
        <PublicLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/menu" component={Menu} />
            <Route path="/reserve" component={Reserve} />
            <Route path="/order" component={Order} />
            <Route path="/reviews" component={Reviews} />
            <Route component={NotFound} />
          </Switch>
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </CartProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
