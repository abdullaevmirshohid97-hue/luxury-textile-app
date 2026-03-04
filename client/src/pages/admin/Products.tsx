import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import ImageUpload from "@/components/ImageUpload";
import type { Product, Category } from "@shared/schema";

export default function AdminProducts() {
  const { toast } = useToast();
  const t = useTranslations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const [formData, setFormData] = useState({
    categoryId: 1,
    slug: "",
    nameEn: "",
    nameRu: "",
    nameUz: "",
    descriptionEn: "",
    descriptionRu: "",
    descriptionUz: "",
    materialEn: "",
    materialRu: "",
    materialUz: "",
    careEn: "",
    careRu: "",
    careUz: "",
    sizes: "",
    colors: "",
    images: "",
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      categoryId: 1,
      slug: "",
      nameEn: "",
      nameRu: "",
      nameUz: "",
      descriptionEn: "",
      descriptionRu: "",
      descriptionUz: "",
      materialEn: "",
      materialRu: "",
      materialUz: "",
      careEn: "",
      careRu: "",
      careUz: "",
      sizes: "",
      colors: "",
      images: "",
      featured: false,
    });
    setEditingProduct(null);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingProduct) {
        return apiRequest("PUT", `/api/admin/products/${editingProduct.id}`, data);
      }
      return apiRequest("POST", "/api/admin/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDialogOpen(false);
      resetForm();
      toast({
        title: t.admin.success,
        description: editingProduct ? t.admin.productUpdated : t.admin.productCreated,
      });
    },
    onError: () => {
      toast({
        title: t.admin.error,
        description: t.admin.failedToSaveProduct,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t.admin.success, description: t.admin.productDeleted });
    },
    onError: () => {
      toast({ title: t.admin.error, description: t.admin.failedToDeleteProduct, variant: "destructive" });
    },
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      categoryId: product.categoryId,
      slug: product.slug,
      nameEn: product.nameEn,
      nameRu: product.nameRu,
      nameUz: product.nameUz,
      descriptionEn: product.descriptionEn || "",
      descriptionRu: product.descriptionRu || "",
      descriptionUz: product.descriptionUz || "",
      materialEn: product.materialEn || "",
      materialRu: product.materialRu || "",
      materialUz: product.materialUz || "",
      careEn: product.careEn || "",
      careRu: product.careRu || "",
      careUz: product.careUz || "",
      sizes: product.sizes || "",
      colors: product.colors || "",
      images: product.images || "",
      featured: product.featured || false,
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
          <h1 className="text-2xl font-semibold" data-testid="text-products-title">{t.admin.products}</h1>
          <p className="text-body text-muted-foreground">{t.admin.manageProductCatalog}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="text-body" data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              {t.admin.addProduct}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? t.admin.editProduct : t.admin.addNewProduct}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-body">{t.admin.slug}</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder={t.admin.productSlug}
                    className="text-body"
                    required
                    data-testid="input-product-slug"
                  />
                </div>
                <div>
                  <Label className="text-body">{t.admin.category}</Label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(v) => setFormData({ ...formData, categoryId: parseInt(v) })}
                  >
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-body">{t.admin.sizes}</Label>
                  <Input
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder={t.admin.sizesPlaceholder}
                    className="text-body"
                  />
                </div>
                <div>
                  <Label className="text-body">{t.admin.colors}</Label>
                  <Input
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder={t.admin.colorsPlaceholder}
                    className="text-body"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-body">{t.admin.images}</Label>
                <ImageUpload
                  value={formData.images}
                  onChange={(val) => setFormData({ ...formData, images: val })}
                  multiple
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  data-testid="switch-featured"
                />
                <Label className="text-body">{t.admin.featured}</Label>
              </div>

              <Button type="submit" className="w-full text-body" disabled={saveMutation.isPending} data-testid="button-save-product">
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingProduct ? t.admin.updateProduct : t.admin.createProduct}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.admin.images}</TableHead>
                  <TableHead>{t.admin.name}</TableHead>
                  <TableHead>{t.admin.category}</TableHead>
                  <TableHead>{t.admin.featured}</TableHead>
                  <TableHead className="text-right">{t.admin.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images && product.images.split(",")[0] ? (
                        <img
                          src={product.images.split(",")[0]}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                          data-testid={`img-product-thumb-${product.id}`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <Plus className="h-4 w-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-body" data-testid={`text-product-row-${product.id}`}>
                      {product.nameEn}
                    </TableCell>
                    <TableCell className="text-body">
                      {categories.find((c) => c.id === product.categoryId)?.nameEn || "-"}
                    </TableCell>
                    <TableCell>
                      {product.featured && <Badge variant="secondary">{t.admin.featured}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          data-testid={`button-edit-product-${product.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(product.id)}
                          data-testid={`button-delete-product-${product.id}`}
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
