import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, MessageSquare, TrendingUp, Users, ThermometerSun, Thermometer } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<{
    products: number;
    categories: number;
    inquiries: number;
    newInquiries: number;
    totalLeads: number;
    hotLeads: number;
    warmLeads: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "Total Leads",
      value: stats?.totalLeads || 0,
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "HOT Leads",
      value: stats?.hotLeads || 0,
      icon: ThermometerSun,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "WARM Leads",
      value: stats?.warmLeads || 0,
      icon: Thermometer,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Total Products",
      value: stats?.products || 0,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Categories",
      value: stats?.categories || 0,
      icon: ShoppingBag,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Inquiries",
      value: stats?.inquiries || 0,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-body text-muted-foreground">Mary Collection Admin Panel</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-body text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold" data-testid={`text-stat-${index}`}>
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/leads">
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-leads">
                <Users className="h-4 w-4 mr-2" />
                View All Leads
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start" data-testid="button-manage-products">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/inquiries">
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-inquiries">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Inquiries
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground mb-4">
              Leads are automatically scored based on business type, language, and source. 
              HOT leads (80-100) require immediate attention.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Lead</span>
                <span className="text-muted-foreground">Qualified</span>
                <span className="text-muted-foreground">Contacted</span>
                <span className="text-muted-foreground">Won</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
