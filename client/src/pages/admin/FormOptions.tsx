import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { FormOption } from "@shared/schema";

const FORM_FIELDS = ["sector", "volume", "product_interest", "lead_source"];

export default function AdminFormOptions() {
  const { toast } = useToast();
  const [editingOption, setEditingOption] = useState<FormOption | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterField, setFilterField] = useState<string>("all");

  const { data: options, isLoading } = useQuery<FormOption[]>({
    queryKey: ["/api/admin/form-options"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<FormOption, "id">) => {
      return apiRequest("POST", "/api/admin/form-options", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-options"] });
      toast({ title: "Success", description: "Form option created" });
      setIsDialogOpen(false);
      setEditingOption(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create form option", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: FormOption) => {
      return apiRequest("PUT", `/api/admin/form-options/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-options"] });
      toast({ title: "Success", description: "Form option updated" });
      setIsDialogOpen(false);
      setEditingOption(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update form option", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/form-options/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-options"] });
      toast({ title: "Success", description: "Form option deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete form option", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      formField: formData.get("formField") as string,
      optionValue: formData.get("optionValue") as string,
      labelUz: formData.get("labelUz") as string,
      labelRu: formData.get("labelRu") as string,
      labelEn: formData.get("labelEn") as string,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      enabled: formData.get("enabled") === "on",
    };

    if (editingOption) {
      updateMutation.mutate({ ...data, id: editingOption.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (option: FormOption) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingOption(null);
    setIsDialogOpen(true);
  };

  const groupedOptions = options?.reduce((acc, opt) => {
    if (!acc[opt.formField]) acc[opt.formField] = [];
    acc[opt.formField].push(opt);
    return acc;
  }, {} as Record<string, FormOption[]>) || {};

  Object.values(groupedOptions).forEach(group => {
    group.sort((a, b) => a.sortOrder - b.sortOrder);
  });

  const displayFields = filterField === "all" ? Object.keys(groupedOptions) : [filterField];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-form-options-title">Form Options</h1>
          <p className="text-muted-foreground">Manage dropdown options for inquiry forms</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-add-form-option">
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingOption ? "Edit Form Option" : "Add Form Option"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formField">Form Field</Label>
                  <Select name="formField" defaultValue={editingOption?.formField || "sector"}>
                    <SelectTrigger data-testid="select-form-field">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORM_FIELDS.map(field => (
                        <SelectItem key={field} value={field}>{field.replace("_", " ").toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="optionValue">Option Value</Label>
                  <Input id="optionValue" name="optionValue" defaultValue={editingOption?.optionValue || ""} required placeholder="e.g., hospitality, retail" data-testid="input-option-value" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="labelUz">Label (UZ)</Label>
                  <Input id="labelUz" name="labelUz" defaultValue={editingOption?.labelUz || ""} required data-testid="input-option-label-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelRu">Label (RU)</Label>
                  <Input id="labelRu" name="labelRu" defaultValue={editingOption?.labelRu || ""} required data-testid="input-option-label-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelEn">Label (EN)</Label>
                  <Input id="labelEn" name="labelEn" defaultValue={editingOption?.labelEn || ""} required data-testid="input-option-label-en" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editingOption?.sortOrder || 0} data-testid="input-option-sort" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="enabled" name="enabled" defaultChecked={editingOption?.enabled ?? true} data-testid="switch-option-enabled" />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-option">
                  {editingOption ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button variant={filterField === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterField("all")}>All</Button>
        {FORM_FIELDS.map(field => (
          <Button key={field} variant={filterField === field ? "default" : "outline"} size="sm" onClick={() => setFilterField(field)}>
            {field.replace("_", " ").charAt(0).toUpperCase() + field.replace("_", " ").slice(1)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {displayFields.map(field => (
            <Card key={field} data-testid={`card-form-field-${field}`}>
              <CardHeader>
                <CardTitle className="text-lg">{field.replace("_", " ").toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupedOptions[field]?.map(option => (
                    <div key={option.id} className={`flex items-center justify-between p-3 border rounded-md ${!option.enabled ? "opacity-50" : ""}`} data-testid={`row-option-${option.id}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.labelEn}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{option.optionValue}</span>
                          <span className="text-xs text-muted-foreground">Order: {option.sortOrder}</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                          <span>UZ: {option.labelUz}</span>
                          <span>RU: {option.labelRu}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(option)} data-testid={`button-edit-option-${option.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(option.id)} data-testid={`button-delete-option-${option.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-sm">No options for this field.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {displayFields.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No form options found. Click "Add Option" to create one.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
