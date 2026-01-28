import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<{
    products: number;
    categories: number;
    inquiries: number;
    newInquiries: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
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
      title: "Total Inquiries",
      value: stats?.inquiries || 0,
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "New Inquiries",
      value: stats?.newInquiries || 0,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-body text-muted-foreground">Overview of your store</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-muted-foreground">
            Welcome to the Mary Collection admin panel. Use the sidebar to manage products, categories, inquiries, and site content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
