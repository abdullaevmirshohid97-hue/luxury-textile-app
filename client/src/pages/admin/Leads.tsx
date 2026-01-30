import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Phone, Mail, Building2, Package, ThermometerSun, ThermometerSnowflake, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTranslations } from "@/lib/i18n";
import { LeadStatus } from "@shared/schema";

interface Lead {
  id: number;
  phone: string;
  email: string | null;
  name: string | null;
  source: string;
  page: string | null;
  leadType: string;
  language: string;
  score: number;
  status: string;
  businessType: string | null;
  productType: string | null;
  estimatedQuantity: string | null;
  message: string | null;
  country: string | null;
  temperature: "HOT" | "WARM" | "COLD";
  createdAt: string;
}

export default function AdminLeads() {
  const { toast } = useToast();
  const t = useTranslations();

  const statusLabels: Record<string, string> = {
    new: t.admin.newLead,
    qualified: t.admin.qualified,
    contacted: t.admin.contacted,
    needs_proposal: t.admin.needsProposal,
    offer_sent: t.admin.offerSent,
    negotiation: t.admin.negotiation,
    won: t.admin.won,
    lost: t.admin.lost,
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    qualified: "bg-purple-100 text-purple-800",
    contacted: "bg-yellow-100 text-yellow-800",
    needs_proposal: "bg-orange-100 text-orange-800",
    offer_sent: "bg-indigo-100 text-indigo-800",
    negotiation: "bg-cyan-100 text-cyan-800",
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: t.admin.statusUpdated });
    },
  });

  const TemperatureIcon = ({ temp }: { temp: string }) => {
    if (temp === "HOT") return <ThermometerSun className="h-4 w-4 text-red-500" />;
    if (temp === "WARM") return <Thermometer className="h-4 w-4 text-orange-500" />;
    return <ThermometerSnowflake className="h-4 w-4 text-blue-500" />;
  };

  const temperatureColors: Record<string, string> = {
    HOT: "bg-red-100 text-red-800 border-red-200",
    WARM: "bg-orange-100 text-orange-800 border-orange-200",
    COLD: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const hotLeads = leads.filter((l) => l.temperature === "HOT");
  const warmLeads = leads.filter((l) => l.temperature === "WARM");
  const coldLeads = leads.filter((l) => l.temperature === "COLD");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">{t.admin.leadsManagement}</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <ThermometerSun className="h-3 w-3 text-red-500" /> {hotLeads.length} {t.admin.hot}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Thermometer className="h-3 w-3 text-orange-500" /> {warmLeads.length} {t.admin.warm}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <ThermometerSnowflake className="h-3 w-3 text-blue-500" /> {coldLeads.length} {t.admin.cold}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {leads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {t.admin.noLeadsYet}
            </CardContent>
          </Card>
        ) : (
          leads.map((lead) => (
            <Card key={lead.id} className={`border-l-4 ${lead.temperature === "HOT" ? "border-l-red-500" : lead.temperature === "WARM" ? "border-l-orange-500" : "border-l-blue-500"}`} data-testid={`card-lead-${lead.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <TemperatureIcon temp={lead.temperature} />
                    <CardTitle className="text-lg">{lead.name || lead.phone}</CardTitle>
                    <Badge className={temperatureColors[lead.temperature]}>
                      {lead.temperature === "HOT" ? t.admin.hot : lead.temperature === "WARM" ? t.admin.warm : t.admin.cold} ({lead.score})
                    </Badge>
                  </div>
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateStatusMutation.mutate({ id: lead.id, status: value })}
                  >
                    <SelectTrigger className="w-40" data-testid={`select-status-${lead.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.phone}</span>
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                  {lead.businessType && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{lead.businessType}</span>
                    </div>
                  )}
                  {lead.productType && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{lead.productType}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{lead.source}</Badge>
                  <Badge variant="outline">{lead.leadType}</Badge>
                  <Badge variant="outline">{lead.language.toUpperCase()}</Badge>
                  {lead.page && <Badge variant="outline">{lead.page}</Badge>}
                  {lead.estimatedQuantity && <Badge variant="outline">{lead.estimatedQuantity} {t.admin.pcs}</Badge>}
                </div>
                {lead.message && (
                  <p className="mt-3 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {lead.message}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(lead.createdAt), "PPp")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
