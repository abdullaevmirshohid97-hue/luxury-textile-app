import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { CtaConfig } from "@shared/schema";

export default function AdminCtaConfigs() {
  const { toast } = useToast();
  const [editingCta, setEditingCta] = useState<CtaConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: ctas, isLoading } = useQuery<CtaConfig[]>({
    queryKey: ["/api/admin/cta-configs"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<CtaConfig, "id">) => {
      return apiRequest("POST", "/api/admin/cta-configs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cta-configs"] });
      toast({ title: "Success", description: "CTA config created" });
      setIsDialogOpen(false);
      setEditingCta(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create CTA config", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: CtaConfig) => {
      return apiRequest("PUT", `/api/admin/cta-configs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cta-configs"] });
      toast({ title: "Success", description: "CTA config updated" });
      setIsDialogOpen(false);
      setEditingCta(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update CTA config", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/cta-configs/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cta-configs"] });
      toast({ title: "Success", description: "CTA config deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete CTA config", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      ctaKey: formData.get("ctaKey") as string,
      labelUz: formData.get("labelUz") as string,
      labelRu: formData.get("labelRu") as string,
      labelEn: formData.get("labelEn") as string,
      helperTextUz: formData.get("helperTextUz") as string || null,
      helperTextRu: formData.get("helperTextRu") as string || null,
      helperTextEn: formData.get("helperTextEn") as string || null,
      targetUrl: formData.get("targetUrl") as string || "/contact",
      enabled: formData.get("enabled") === "on",
    };

    if (editingCta) {
      updateMutation.mutate({ ...data, id: editingCta.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (cta: CtaConfig) => {
    setEditingCta(cta);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCta(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-cta-configs-title">CTA Configurations</h1>
          <p className="text-muted-foreground">Manage call-to-action buttons across the site</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-add-cta">
              <Plus className="h-4 w-4 mr-2" />
              Add CTA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCta ? "Edit CTA Config" : "Add CTA Config"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaKey">CTA Key</Label>
                  <Input id="ctaKey" name="ctaKey" defaultValue={editingCta?.ctaKey || ""} required placeholder="e.g., home_hero, business_inquiry" data-testid="input-cta-key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input id="targetUrl" name="targetUrl" defaultValue={editingCta?.targetUrl || "/contact"} data-testid="input-target-url" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="labelUz">Label (UZ)</Label>
                  <Input id="labelUz" name="labelUz" defaultValue={editingCta?.labelUz || ""} required data-testid="input-label-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelRu">Label (RU)</Label>
                  <Input id="labelRu" name="labelRu" defaultValue={editingCta?.labelRu || ""} required data-testid="input-label-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelEn">Label (EN)</Label>
                  <Input id="labelEn" name="labelEn" defaultValue={editingCta?.labelEn || ""} required data-testid="input-label-en" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="helperTextUz">Helper Text (UZ)</Label>
                  <Input id="helperTextUz" name="helperTextUz" defaultValue={editingCta?.helperTextUz || ""} data-testid="input-helper-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="helperTextRu">Helper Text (RU)</Label>
                  <Input id="helperTextRu" name="helperTextRu" defaultValue={editingCta?.helperTextRu || ""} data-testid="input-helper-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="helperTextEn">Helper Text (EN)</Label>
                  <Input id="helperTextEn" name="helperTextEn" defaultValue={editingCta?.helperTextEn || ""} data-testid="input-helper-en" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="enabled" name="enabled" defaultChecked={editingCta?.enabled ?? true} data-testid="switch-cta-enabled" />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-cta">
                  {editingCta ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ctas?.map((cta) => (
            <Card key={cta.id} className={!cta.enabled ? "opacity-50" : ""} data-testid={`card-cta-${cta.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cta.labelEn}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{cta.ctaKey}</span>
                    </div>
                    {cta.helperTextEn && (
                      <p className="text-sm text-muted-foreground mt-1">{cta.helperTextEn}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span>{cta.targetUrl}</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>UZ: {cta.labelUz}</span>
                      <span>RU: {cta.labelRu}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(cta)} data-testid={`button-edit-cta-${cta.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(cta.id)} data-testid={`button-delete-cta-${cta.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!ctas || ctas.length === 0) && (
            <Card className="col-span-2">
              <CardContent className="p-8 text-center text-muted-foreground">
                No CTA configurations found. Click "Add CTA" to create one.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
