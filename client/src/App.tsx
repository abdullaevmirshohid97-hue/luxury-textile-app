import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Product from "@/pages/Product";
import Contact from "@/pages/Contact";

import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/Layout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminInquiries from "@/pages/admin/Inquiries";
import AdminSettings from "@/pages/admin/Settings";

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
      <Route path="/product/:slug">
        <PublicRoute component={Product} />
      </Route>
      <Route path="/contact">
        <PublicRoute component={Contact} />
      </Route>
      <Route path="/admin/login" component={AdminLogin} />
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
