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

export default function AdminSettings() {
  const { toast } = useToast();

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
      toast({ title: "Success", description: "Settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const handleToggleAI = (checked: boolean) => {
    updateSettingMutation.mutate({ key: "ai_assistant_enabled", value: checked.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-settings-title">Settings</h1>
        <p className="text-body text-muted-foreground">Configure your store settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-body">Enable AI Chat Assistant</Label>
                <p className="text-body text-sm text-muted-foreground">
                  Allow visitors to chat with an AI assistant for product recommendations
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
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body text-sm text-muted-foreground">
            Contact information is managed in the Site Content section and displayed on the Contact page and footer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
