import { Link, useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BarChart3, Package, Tag, MessageSquare, Settings, LogOut, Users, Layers, MousePointer, ShieldCheck, ListOrdered } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useTranslations } from "@/lib/i18n";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const t = useTranslations();

  const isSubdomain = typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const pathPrefix = isSubdomain ? "" : "/admin";

  const menuItems = [
    { href: `${pathPrefix}/`, label: t.admin.dashboard, icon: LayoutDashboard },
    { href: `${pathPrefix}/analytics`, label: t.admin.analytics, icon: BarChart3 },
    { href: `${pathPrefix}/leads`, label: t.admin.leads, icon: Users },
    { href: `${pathPrefix}/products`, label: t.admin.products, icon: Package },
    { href: `${pathPrefix}/categories`, label: t.admin.categories, icon: Tag },
    { href: `${pathPrefix}/inquiries`, label: t.admin.inquiries, icon: MessageSquare },
    { href: `${pathPrefix}/process-steps`, label: t.admin.processSteps, icon: Layers },
    { href: `${pathPrefix}/cta-configs`, label: t.admin.ctaConfigs, icon: MousePointer },
    { href: `${pathPrefix}/trust-blocks`, label: t.admin.trustBlocks, icon: ShieldCheck },
    { href: `${pathPrefix}/form-options`, label: t.admin.formOptions, icon: ListOrdered },
    { href: `${pathPrefix}/settings`, label: t.admin.settings, icon: Settings },
  ];

  const { data: session, isLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/session"],
    retry: false,
  });

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    setLocation(isSubdomain ? "/login" : "/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t.admin.loading}</div>
      </div>
    );
  }

  if (!session?.authenticated) {
    setLocation(isSubdomain ? "/login" : "/admin/login");
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  const getMainDomainUrl = () => {
    if (typeof window === "undefined") return "/";
    const hostname = window.location.hostname;
    if (hostname.startsWith("admin.")) {
      return `http://${hostname.replace("admin.", "")}${window.location.port ? `:${window.location.port}` : ""}`;
    }
    return "/";
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link href={isSubdomain ? "/" : "/admin"} className="flex items-center gap-2">
              <span className="text-lg font-semibold">{t.admin.title}</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location === item.href || (item.href !== "/" && item.href !== "/admin" && location.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          data-testid={`link-admin-${item.href.replace("/admin/", "").replace("/admin", "dashboard").replace("/", "dashboard")}`}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span className="text-body">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-4 border-t mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-body"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.admin.logout}
            </Button>
          </div>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center gap-4 p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <a href={getMainDomainUrl()} className="text-body text-sm text-muted-foreground hover:text-foreground">
              {t.admin.viewSite}
            </a>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
