import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, MessageSquare, Save } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

export default function AdminSettings() {
  const { toast } = useToast();
  const t = useTranslations();

  const { data: settings, isLoading } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["/api/admin/settings"],
  });

  const aiEnabled = settings?.find((s) => s.key === "ai_assistant_enabled")?.value === "true";

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest("POST", "/api/admin/settings", { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: t.admin.success, description: t.admin.settingsSaved });
    },
    onError: () => {
      toast({ title: t.admin.error, description: t.admin.failedToSaveSettings, variant: "destructive" });
    },
  });

  const handleToggleAI = (checked: boolean) => {
    updateSettingMutation.mutate({ key: "ai_assistant_enabled", value: checked.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-settings-title">{t.admin.settings}</h1>
        <p className="text-body text-muted-foreground">{t.admin.configureSettings}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t.admin.aiAssistant}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body">{t.admin.enableAiChat}</Label>
                <p className="text-body text-sm text-muted-foreground">
                  {t.admin.aiChatDesc}
                </p>
              </div>
              <Switch
                checked={aiEnabled}
                onCheckedChange={handleToggleAI}
                disabled={updateSettingMutation.isPending}
                data-testid="switch-ai-enabled"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.admin.contactInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body text-sm text-muted-foreground">
            {t.admin.contactInfoDesc}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
