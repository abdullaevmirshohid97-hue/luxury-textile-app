import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import type { TrustBlock } from "@shared/schema";

const BLOCK_TYPES = ["capability", "risk_reduction", "authority", "use_case", "feature"];
const PAGES = ["home", "business", "process", "contact", "global"];

export default function AdminTrustBlocks() {
  const { toast } = useToast();
  const [editingBlock, setEditingBlock] = useState<TrustBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterPage, setFilterPage] = useState<string>("all");

  const { data: blocks, isLoading } = useQuery<TrustBlock[]>({
    queryKey: ["/api/admin/trust-blocks"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<TrustBlock, "id">) => {
      return apiRequest("POST", "/api/admin/trust-blocks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-blocks"] });
      toast({ title: "Success", description: "Trust block created" });
      setIsDialogOpen(false);
      setEditingBlock(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create trust block", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: TrustBlock) => {
      return apiRequest("PUT", `/api/admin/trust-blocks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-blocks"] });
      toast({ title: "Success", description: "Trust block updated" });
      setIsDialogOpen(false);
      setEditingBlock(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update trust block", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/trust-blocks/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trust-blocks"] });
      toast({ title: "Success", description: "Trust block deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete trust block", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      blockKey: formData.get("blockKey") as string,
      blockType: formData.get("blockType") as string,
      page: formData.get("page") as string,
      titleUz: formData.get("titleUz") as string,
      titleRu: formData.get("titleRu") as string,
      titleEn: formData.get("titleEn") as string,
      descriptionUz: formData.get("descriptionUz") as string || null,
      descriptionRu: formData.get("descriptionRu") as string || null,
      descriptionEn: formData.get("descriptionEn") as string || null,
      icon: formData.get("icon") as string || null,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      enabled: formData.get("enabled") === "on",
    };

    if (editingBlock) {
      updateMutation.mutate({ ...data, id: editingBlock.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (block: TrustBlock) => {
    setEditingBlock(block);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBlock(null);
    setIsDialogOpen(true);
  };

  const filteredBlocks = blocks?.filter(b => filterPage === "all" || b.page === filterPage)
    .sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-trust-blocks-title">Trust Blocks</h1>
          <p className="text-muted-foreground">Manage trust signals and capabilities displayed across pages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-add-trust-block">
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlock ? "Edit Trust Block" : "Add Trust Block"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blockKey">Block Key</Label>
                  <Input id="blockKey" name="blockKey" defaultValue={editingBlock?.blockKey || ""} required data-testid="input-block-key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Lucide name)</Label>
                  <Input id="icon" name="icon" defaultValue={editingBlock?.icon || ""} data-testid="input-block-icon" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blockType">Block Type</Label>
                  <Select name="blockType" defaultValue={editingBlock?.blockType || "capability"}>
                    <SelectTrigger data-testid="select-block-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOCK_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type.replace("_", " ").toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page">Page</Label>
                  <Select name="page" defaultValue={editingBlock?.page || "home"}>
                    <SelectTrigger data-testid="select-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGES.map(page => (
                        <SelectItem key={page} value={page}>{page.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleUz">Title (UZ)</Label>
                  <Input id="titleUz" name="titleUz" defaultValue={editingBlock?.titleUz || ""} required data-testid="input-block-title-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleRu">Title (RU)</Label>
                  <Input id="titleRu" name="titleRu" defaultValue={editingBlock?.titleRu || ""} required data-testid="input-block-title-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Title (EN)</Label>
                  <Input id="titleEn" name="titleEn" defaultValue={editingBlock?.titleEn || ""} required data-testid="input-block-title-en" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionUz">Description (UZ)</Label>
                  <Textarea id="descriptionUz" name="descriptionUz" defaultValue={editingBlock?.descriptionUz || ""} data-testid="input-block-desc-uz" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionRu">Description (RU)</Label>
                  <Textarea id="descriptionRu" name="descriptionRu" defaultValue={editingBlock?.descriptionRu || ""} data-testid="input-block-desc-ru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">Description (EN)</Label>
                  <Textarea id="descriptionEn" name="descriptionEn" defaultValue={editingBlock?.descriptionEn || ""} data-testid="input-block-desc-en" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editingBlock?.sortOrder || 0} data-testid="input-block-sort" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="enabled" name="enabled" defaultChecked={editingBlock?.enabled ?? true} data-testid="switch-block-enabled" />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-block">
                  {editingBlock ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button variant={filterPage === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterPage("all")}>All</Button>
        {PAGES.map(page => (
          <Button key={page} variant={filterPage === page ? "default" : "outline"} size="sm" onClick={() => setFilterPage(page)}>
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBlocks.map((block) => (
            <Card key={block.id} className={!block.enabled ? "opacity-50" : ""} data-testid={`card-trust-block-${block.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{block.titleEn}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{block.blockKey}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{block.page}</span>
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">{block.blockType}</span>
                      </div>
                      {block.descriptionEn && (
                        <p className="text-sm text-muted-foreground mt-1">{block.descriptionEn}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>UZ: {block.titleUz}</span>
                        <span>RU: {block.titleRu}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(block)} data-testid={`button-edit-block-${block.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(block.id)} data-testid={`button-delete-block-${block.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredBlocks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No trust blocks found. Click "Add Block" to create one.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
