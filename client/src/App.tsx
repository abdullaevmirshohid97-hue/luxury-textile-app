import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import SpaCollection from "@/pages/SpaCollection";
import PastelCollection from "@/pages/PastelCollection";
import SpaHotel from "@/pages/SpaHotel";
import BarberShop from "@/pages/BarberShop";
import Accessories from "@/pages/Accessories";
import BulkOrder from "@/pages/BulkOrder";
import ExportMiddleEast from "@/pages/ExportMiddleEast";
import ExportEurope from "@/pages/ExportEurope";
import ExportBarberGlobal from "@/pages/ExportBarberGlobal";
import Product from "@/pages/Product";
import Contact from "@/pages/Contact";

import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/Layout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLeads from "@/pages/admin/Leads";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminInquiries from "@/pages/admin/Inquiries";
import AdminAnalytics from "@/pages/admin/Analytics";

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicRoute component={Home} />
      </Route>
      <Route path="/catalog">
        <PublicRoute component={Catalog} />
      </Route>
      <Route path="/spa">
        <PublicRoute component={SpaCollection} />
      </Route>
      <Route path="/pastel">
        <PublicRoute component={PastelCollection} />
      </Route>
      <Route path="/spa-hotel">
        <PublicRoute component={SpaHotel} />
      </Route>
      <Route path="/barber">
        <PublicRoute component={BarberShop} />
      </Route>
      <Route path="/accessories">
        <PublicRoute component={Accessories} />
      </Route>
      <Route path="/bulk-order">
        <PublicRoute component={BulkOrder} />
      </Route>
      <Route path="/export/middle-east">
        <PublicRoute component={ExportMiddleEast} />
      </Route>
      <Route path="/export/europe">
        <PublicRoute component={ExportEurope} />
      </Route>
      <Route path="/export/barber-global">
        <PublicRoute component={ExportBarberGlobal} />
      </Route>
      <Route path="/product/:slug">
        <PublicRoute component={Product} />
      </Route>
      <Route path="/contact">
        <PublicRoute component={Contact} />
      </Route>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/leads">
        <AdminRoute component={AdminLeads} />
      </Route>
      <Route path="/admin/products">
        <AdminRoute component={AdminProducts} />
      </Route>
      <Route path="/admin/categories">
        <AdminRoute component={AdminCategories} />
      </Route>
      <Route path="/admin/inquiries">
        <AdminRoute component={AdminInquiries} />
      </Route>
      <Route path="/admin/settings">
        <AdminRoute component={AdminSettings} />
      </Route>
      <Route path="/admin/analytics">
        <AdminRoute component={AdminAnalytics} />
      </Route>
      <Route path="/admin">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
