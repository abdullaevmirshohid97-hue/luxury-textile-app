import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import type { ProcessStep } from "@shared/schema";

export default function AdminProcessSteps() {
  const { toast } = useToast();
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: steps, isLoading } = useQuery<ProcessStep[]>({
    queryKey: ["/api/admin/process-steps"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<ProcessStep, "id">) => {
      return apiRequest("POST", "/api/admin/process-steps", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/process-steps"] });
      toast({ title: "Success", description: "Process step created" });
      setIsDialogOpen(false);
      setEditingStep(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create process step", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: ProcessStep) => {
      return apiRequest("PUT", `/api/admin/process-steps/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/process-steps"] });
      toast({ title: "Success", description: "Process step updated" });
      setIsDialogOpen(false);
      setEditingStep(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update process step", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/process-steps/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/process-steps"] });
      toast({ title: "Success", description: "Process step deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete process step", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      stepKey: formData.get("stepKey") as string,
      titleUz: formData.get("titleUz") as string,
      titleRu: formData.get("titleRu") as string,
      titleEn: formData.get("titleEn") as string,
      descriptionUz: formData.get("descriptionUz") as string,
      descriptionRu: formData.get("descriptionRu") as string,
      descriptionEn: formData.get("descriptionEn") as string,
      icon: formData.get("icon") as string,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      enabled: formData.get("enabled") === "on",
    };

    if (editingStep) {
      updateMutation.mutate({ ...data, id: editingStep.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (step: ProcessStep) => {
    setEditingStep(step);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingStep(null);
    setIsDialogOpen(true);
  };

  const sortedSteps = steps?.slice().sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-process-steps-title">Process Steps</h1>
          <p className="text-muted-foreground">Manage manufacturing process steps displayed on the Process page</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-add-process-step">
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStep ? "Edit Process Step" : "Add Process Step"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stepKey">Step Key</Label>
                  <Input id="stepKey" name="stepKey" defaultValue={editingStep?.stepKey || ""} required data-testid="input-step-key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Lucide name)</Label>
                  <Input id="icon" name="icon" defaultValue={editingStep?.icon || "MessageSquare"} data-testid="input-icon" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleUz">Title (UZ)</Label>
                  <Input id="titleUz" name="titleUz" defaultValue={editingStep?.titleUz || ""} required data-testid="input-title-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleRu">Title (RU)</Label>
                  <Input id="titleRu" name="titleRu" defaultValue={editingStep?.titleRu || ""} required data-testid="input-title-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title (EN)</Label>
                  <Input id="titleEn" name="titleEn" defaultValue={editingStep?.titleEn || ""} required data-testid="input-title-en" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionUz">Description (UZ)</Label>
                  <Textarea id="descriptionUz" name="descriptionUz" defaultValue={editingStep?.descriptionUz || ""} required data-testid="input-desc-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionRu">Description (RU)</Label>
                  <Textarea id="descriptionRu" name="descriptionRu" defaultValue={editingStep?.descriptionRu || ""} required data-testid="input-desc-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">Description (EN)</Label>
                  <Textarea id="descriptionEn" name="descriptionEn" defaultValue={editingStep?.descriptionEn || ""} required data-testid="input-desc-en" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editingStep?.sortOrder || 0} data-testid="input-sort-order" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="enabled" name="enabled" defaultChecked={editingStep?.enabled ?? true} data-testid="switch-enabled" />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-step">
                  {editingStep ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSteps.map((step) => (
            <Card key={step.id} className={!step.enabled ? "opacity-50" : ""} data-testid={`card-process-step-${step.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.titleEn}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{step.stepKey}</span>
                        <span className="text-xs text-muted-foreground">Order: {step.sortOrder}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.descriptionEn}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>UZ: {step.titleUz}</span>
                        <span>RU: {step.titleRu}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(step)} data-testid={`button-edit-step-${step.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(step.id)} data-testid={`button-delete-step-${step.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {sortedSteps.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No process steps found. Click "Add Step" to create one.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
