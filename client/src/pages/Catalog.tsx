import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLanguageStore, getLocalizedField } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

import productBathrobe1 from "@/assets/images/product-bathrobe_1.jpg";
import productBathrobe2 from "@/assets/images/product-bathrobe_2.jpg";
import productBathrobe3 from "@/assets/images/product-bathrobe_3.jpg";
import productTowel1 from "@/assets/images/product-towel_1.jpg";
import productTowel2 from "@/assets/images/product-towel_2.jpg";
import productTowel3 from "@/assets/images/product-towel_3.jpg";

const productImages: Record<string, string> = {
  "bathrobe-1": productBathrobe1,
  "bathrobe-2": productBathrobe2,
  "bathrobe-3": productBathrobe3,
  "towel-1": productTowel1,
  "towel-2": productTowel2,
  "towel-3": productTowel3,
};

const defaultProducts: Product[] = [
  { id: 1, categoryId: 1, slug: "classic-bathrobe", nameEn: "Classic Cotton Bathrobe", nameRu: "Классический хлопковый халат", nameUz: "Klassik paxta xalat", descriptionEn: "Luxurious cotton bathrobe in cream color", descriptionRu: "Роскошный хлопковый халат кремового цвета", descriptionUz: "Krem rangidagi hashamatli paxta xalat", materialEn: "100% Premium Egyptian Cotton", materialRu: "100% Премиальный египетский хлопок", materialUz: "100% Premium Misr paxtasi", careEn: "Machine wash cold, tumble dry low", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL", colors: "Cream,Beige,White", images: "bathrobe-1", featured: true },
  { id: 2, categoryId: 1, slug: "spa-bathrobe", nameEn: "Spa Luxury Bathrobe", nameRu: "Спа-халат люкс", nameUz: "Spa hashamat xalati", descriptionEn: "Premium spa bathrobe in soft pastel tones", descriptionRu: "Премиальный спа-халат в мягких пастельных тонах", descriptionUz: "Yumshoq pastel ranglardagi premium spa xalati", materialEn: "100% Organic Cotton", materialRu: "100% Органический хлопок", materialUz: "100% Organik paxta", careEn: "Machine wash cold", careRu: "Машинная стирка в холодной воде", careUz: "Sovuq suvda yuvish", sizes: "S,M,L,XL,XXL", colors: "Light Pink,Mint,Lavender", images: "bathrobe-2", featured: true },
  { id: 3, categoryId: 1, slug: "velour-bathrobe", nameEn: "Velour Touch Bathrobe", nameRu: "Велюровый халат", nameUz: "Velur xalat", descriptionEn: "Ultra-soft velour bathrobe", descriptionRu: "Ультрамягкий велюровый халат", descriptionUz: "O'ta yumshoq velur xalat", materialEn: "Cotton Velour Blend", materialRu: "Хлопковый велюр", materialUz: "Paxta velur aralashmasi", careEn: "Gentle cycle, hang dry", careRu: "Деликатная стирка", careUz: "Nozik yuvish", sizes: "M,L,XL", colors: "Taupe,Gray,Ivory", images: "bathrobe-3", featured: false },
  { id: 4, categoryId: 2, slug: "bath-towel-set", nameEn: "Premium Bath Towel Set", nameRu: "Премиум набор банных полотенец", nameUz: "Premium hammom sochiq to'plami", descriptionEn: "Set of luxurious bath towels", descriptionRu: "Набор роскошных банных полотенец", descriptionUz: "Hashamatli hammom sochiqlari to'plami", materialEn: "100% Long-Staple Cotton", materialRu: "100% Длинноволокнистый хлопок", materialUz: "100% Uzun tolali paxta", careEn: "Machine wash warm", careRu: "Машинная стирка в теплой воде", careUz: "Iliq suvda yuvish", sizes: "Standard,Large", colors: "White,Cream,Sand", images: "towel-1", featured: true },
  { id: 5, categoryId: 2, slug: "hand-towels", nameEn: "Elegant Hand Towels", nameRu: "Элегантные полотенца для рук", nameUz: "Nafis qo'l sochiqlari", descriptionEn: "Soft and absorbent hand towels", descriptionRu: "Мягкие и впитывающие полотенца", descriptionUz: "Yumshoq va singdiruvchi sochiqlar", materialEn: "Turkish Cotton", materialRu: "Турецкий хлопок", materialUz: "Turk paxtasi", careEn: "Machine wash", careRu: "Машинная стирка", careUz: "Mashina yuvish", sizes: "Standard", colors: "Blush,Sage,Stone", images: "towel-2", featured: false },
  { id: 6, categoryId: 2, slug: "luxury-towel-collection", nameEn: "Luxury Towel Collection", nameRu: "Коллекция люксовых полотенец", nameUz: "Hashamatli sochiqlar kolleksiyasi", descriptionEn: "Complete luxury bathroom towel set", descriptionRu: "Полный набор роскошных полотенец", descriptionUz: "To'liq hashamatli hammom sochiq to'plami", materialEn: "Zero-Twist Cotton", materialRu: "Хлопок Zero-Twist", materialUz: "Zero-Twist paxta", careEn: "Machine wash cold", careRu: "Машинная стирка холодной водой", careUz: "Sovuq suvda yuvish", sizes: "Set of 6", colors: "Natural,Oatmeal,Pearl", images: "towel-3", featured: true },
];

const defaultCategories: Category[] = [
  { id: 1, slug: "bathrobes", nameEn: "Bathrobes", nameRu: "Халаты", nameUz: "Xalatlar", descriptionEn: "Luxury cotton bathrobes", descriptionRu: "Роскошные хлопковые халаты", descriptionUz: "Hashamatli paxta xalatlar", image: null },
  { id: 2, slug: "towels", nameEn: "Towels", nameRu: "Полотенца", nameUz: "Sochiqlar", descriptionEn: "Premium bath towels", descriptionRu: "Премиальные банные полотенца", descriptionUz: "Premium hammom sochiqlari", image: null },
];

const colorOptions = [
  { value: "all", labelEn: "All Colors", labelRu: "Все цвета", labelUz: "Barcha ranglar" },
  { value: "white", labelEn: "White", labelRu: "Белый", labelUz: "Oq" },
  { value: "cream", labelEn: "Cream", labelRu: "Кремовый", labelUz: "Krem" },
  { value: "beige", labelEn: "Beige", labelRu: "Бежевый", labelUz: "Bej" },
  { value: "pink", labelEn: "Pink", labelRu: "Розовый", labelUz: "Pushti" },
];

const sizeOptions = [
  { value: "all", labelEn: "All Sizes", labelRu: "Все размеры", labelUz: "Barcha o'lchamlar" },
  { value: "S", labelEn: "Small", labelRu: "Маленький", labelUz: "Kichik" },
  { value: "M", labelEn: "Medium", labelRu: "Средний", labelUz: "O'rta" },
  { value: "L", labelEn: "Large", labelRu: "Большой", labelUz: "Katta" },
  { value: "XL", labelEn: "X-Large", labelRu: "Очень большой", labelUz: "Juda katta" },
];

export default function Catalog() {
  const t = useTranslations();
  const { language } = useLanguageStore();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const categoryFromUrl = params.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");

  const { data: products = defaultProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = defaultCategories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== "all") {
        const category = categories.find((c) => c.slug === selectedCategory);
        if (category && product.categoryId !== category.id) return false;
      }
      if (selectedColor !== "all" && product.colors) {
        if (!product.colors.toLowerCase().includes(selectedColor.toLowerCase())) return false;
      }
      if (selectedSize !== "all" && product.sizes) {
        if (!product.sizes.includes(selectedSize)) return false;
      }
      return true;
    });
  }, [products, categories, selectedCategory, selectedColor, selectedSize]);

  const getLabelByLang = (option: { labelEn: string; labelRu: string; labelUz: string }) => {
    if (language === "ru") return option.labelRu;
    if (language === "uz") return option.labelUz;
    return option.labelEn;
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-catalog-title">
            {t.catalog.title}
          </h1>
          <p className="text-body text-lg text-muted-foreground" data-testid="text-catalog-subtitle">
            {t.catalog.subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-64 shrink-0"
          >
            <Card className="p-6">
              <h2 className="font-semibold mb-6">{t.catalog.filters}</h2>

              <div className="space-y-6">
                <div>
                  <Label className="text-body text-sm mb-2 block">{t.catalog.category}</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.catalog.all}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {getLocalizedField(category, "name", language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-body text-sm mb-2 block">{t.catalog.color}</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger data-testid="select-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {getLabelByLang(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-body text-sm mb-2 block">{t.catalog.size}</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger data-testid="select-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {getLabelByLang(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.aside>

          <div className="flex-1">
            {productsLoading || categoriesLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-[3/4] rounded-t-lg" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover-elevate h-full flex flex-col">
                      <Link href={`/product/${product.slug}`}>
                        <div className="aspect-[3/4] overflow-hidden cursor-pointer">
                          <img
                            src={productImages[product.images || ""] || productBathrobe1}
                            alt={getLocalizedField(product, "name", language)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <Link href={`/product/${product.slug}`}>
                          <h3
                            className="font-semibold mb-2 cursor-pointer hover:text-primary transition-colors"
                            data-testid={`text-product-name-${product.id}`}
                          >
                            {getLocalizedField(product, "name", language)}
                          </h3>
                        </Link>
                        <p
                          className="text-body text-sm text-muted-foreground mb-4 flex-1"
                          data-testid={`text-product-desc-${product.id}`}
                        >
                          {getLocalizedField(product, "description", language)}
                        </p>
                        <Link href={`/contact?product=${product.slug}`}>
                          <Button className="w-full text-body" variant="outline" data-testid={`button-request-info-${product.id}`}>
                            {t.catalog.requestInfo}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!productsLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-body text-muted-foreground">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
