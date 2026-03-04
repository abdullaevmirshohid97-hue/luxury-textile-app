import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  MousePointer2, 
  Bot, 
  BarChart3,
  Calendar
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsStats {
  overview: { type: string; count: number }[];
  pages: { page: string; count: number }[];
  products: { productId: number; count: number }[];
}

export default function AdminAnalytics() {
  const t = useTranslations();
  const [timeframe, setTimeframe] = useState<string>("week");

  const { data: stats, isLoading } = useQuery<AnalyticsStats>({
    queryKey: [`/api/admin/analytics?timeframe=${timeframe}`],
  });

  const getCount = (type: string) => 
    stats?.overview.find(o => o.type === type)?.count || 0;

  const visitors = getCount("page_view");
  const inquiries = getCount("inquiry");
  const aiSessions = getCount("chat_usage");
  const aiConversions = getCount("chat_conversion");
  
  const conversionRate = aiSessions > 0 
    ? ((aiConversions / aiSessions) * 100).toFixed(1) 
    : "0.0";

  const summaryCards = [
    {
      title: "Total Visitors",
      value: visitors,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Inquiries",
      value: inquiries,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "AI Chat Sessions",
      value: aiSessions,
      icon: Bot,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "AI Conversion",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-analytics-title">
            Analytics Overview
          </h1>
          <p className="text-body text-muted-foreground">
            Track your website performance and user engagement
          </p>
        </div>
        
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold" data-testid={`text-analytics-stat-${index}`}>
                  {card.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-primary" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.pages.slice(0, 5).map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {page.page === "/" ? "Home" : page.page}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${(page.count / visitors) * 100}%` 
                          }} 
                        />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">
                        {page.count}
                      </span>
                    </div>
                  </div>
                ))}
                {!stats?.pages.length && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No page view data available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI Chat Engagement</span>
                    <span className="font-medium">
                      {visitors > 0 ? ((aiSessions / visitors) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${visitors > 0 ? (aiSessions / visitors) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inquiry Conversion</span>
                    <span className="font-medium">
                      {visitors > 0 ? ((inquiries / visitors) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${visitors > 0 ? (inquiries / visitors) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{aiConversions}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Leads from AI
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{inquiries}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Direct Inquiries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
