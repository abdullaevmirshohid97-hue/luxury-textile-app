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
import { LayoutDashboard, BarChart3, Package, Tag, MessageSquare, Settings, LogOut, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useTranslations } from "@/lib/i18n";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const t = useTranslations();

  const menuItems = [
    { href: "/admin", label: t.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/leads", label: t.admin.leads, icon: Users },
    { href: "/admin/products", label: t.admin.products, icon: Package },
    { href: "/admin/categories", label: t.admin.categories, icon: Tag },
    { href: "/admin/inquiries", label: t.admin.inquiries, icon: MessageSquare },
    { href: "/admin/settings", label: t.admin.settings, icon: Settings },
  ];

  const { data: session, isLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/session"],
    retry: false,
  });

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t.admin.loading}</div>
      </div>
    );
  }

  if (!session?.authenticated) {
    setLocation("/admin/login");
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg font-semibold">{t.admin.title}</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          data-testid={`link-admin-${item.href.replace("/admin/", "").replace("/admin", "dashboard")}`}
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
            <Link href="/" className="text-body text-sm text-muted-foreground hover:text-foreground">
              {t.admin.viewSite}
            </Link>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
