import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import ImageUpload from "@/components/ImageUpload";
import type { Category } from "@shared/schema";

export default function AdminCategories() {
  const { toast } = useToast();
  const t = useTranslations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const [formData, setFormData] = useState({
    slug: "",
    nameEn: "",
    nameRu: "",
    nameUz: "",
    descriptionEn: "",
    descriptionRu: "",
    descriptionUz: "",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      nameEn: "",
      nameRu: "",
      nameUz: "",
      descriptionEn: "",
      descriptionRu: "",
      descriptionUz: "",
      image: "",
    });
    setEditingCategory(null);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingCategory) {
        return apiRequest("PUT", `/api/admin/categories/${editingCategory.id}`, data);
      }
      return apiRequest("POST", "/api/admin/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: t.admin.success,
        description: editingCategory ? t.admin.categoryUpdated : t.admin.categoryCreated,
      });
    },
    onError: () => {
      toast({
        title: t.admin.error,
        description: t.admin.failedToSaveCategory,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: t.admin.success, description: t.admin.categoryDeleted });
    },
    onError: () => {
      toast({ title: t.admin.error, description: t.admin.failedToDeleteCategory, variant: "destructive" });
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      slug: category.slug,
      nameEn: category.nameEn,
      nameRu: category.nameRu,
      nameUz: category.nameUz,
      descriptionEn: category.descriptionEn || "",
      descriptionRu: category.descriptionRu || "",
      descriptionUz: category.descriptionUz || "",
      image: category.image || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-categories-title">{t.admin.categories}</h1>
          <p className="text-body text-muted-foreground">{t.admin.manageCategories}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="text-body" data-testid="button-add-category">
              <Plus className="h-4 w-4 mr-2" />
              {t.admin.addCategory}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCategory ? t.admin.editCategory : t.admin.addNewCategory}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-body">{t.admin.slug}</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={t.admin.categorySlug}
                  className="text-body"
                  required
                  data-testid="input-category-slug"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-body">{t.admin.nameMultilang}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder={t.admin.english}
                    className="text-body"
                    required
                  />
                  <Input
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    placeholder={t.admin.russian}
                    className="text-body"
                    required
                  />
                  <Input
                    value={formData.nameUz}
                    onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                    placeholder={t.admin.uzbek}
                    className="text-body"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-body">{t.admin.descriptionMultilang}</Label>
                <Textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder={t.admin.englishDesc}
                  className="text-body"
                  rows={2}
                />
                <Textarea
                  value={formData.descriptionRu}
                  onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                  placeholder={t.admin.russianDesc}
                  className="text-body"
                  rows={2}
                />
                <Textarea
                  value={formData.descriptionUz}
                  onChange={(e) => setFormData({ ...formData, descriptionUz: e.target.value })}
                  placeholder={t.admin.uzbekDesc}
                  className="text-body"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-body">{t.admin.categoryImage}</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(val) => setFormData({ ...formData, image: val })}
                />
              </div>

              <Button type="submit" className="w-full text-body" disabled={saveMutation.isPending} data-testid="button-save-category">
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingCategory ? t.admin.updateCategory : t.admin.createCategory}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.admin.categoryImage}</TableHead>
                  <TableHead>{t.admin.name}</TableHead>
                  <TableHead>{t.admin.slug}</TableHead>
                  <TableHead className="text-right">{t.admin.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                          data-testid={`img-category-thumb-${category.id}`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <Plus className="h-4 w-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-body" data-testid={`text-category-row-${category.id}`}>
                      {category.nameEn}
                    </TableCell>
                    <TableCell className="text-body text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          data-testid={`button-edit-category-${category.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(category.id)}
                          data-testid={`button-delete-category-${category.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
