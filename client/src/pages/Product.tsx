import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLanguageStore, getLocalizedField } from "@/lib/i18n";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Product } from "@shared/schema";

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
  { id: 1, categoryId: 1, slug: "classic-bathrobe", nameEn: "Classic Cotton Bathrobe", nameRu: "Классический хлопковый халат", nameUz: "Klassik paxta xalat", descriptionEn: "Luxurious cotton bathrobe in cream color. Perfect for your everyday luxury experience at home.", descriptionRu: "Роскошный хлопковый халат кремового цвета. Идеально подходит для повседневного ощущения роскоши дома.", descriptionUz: "Krem rangidagi hashamatli paxta xalat. Kundalik uy qulayligi uchun ideal.", materialEn: "100% Premium Egyptian Cotton, 400 GSM weight, double-stitched seams for durability", materialRu: "100% Премиальный египетский хлопок, плотность 400 г/м², двойная строчка для прочности", materialUz: "100% Premium Misr paxtasi, 400 GSM og'irlik, mustahkamlik uchun ikki marta tikilgan", careEn: "Machine wash cold on gentle cycle. Tumble dry on low heat. Do not bleach. Iron on low if needed.", careRu: "Машинная стирка в холодной воде в деликатном режиме. Сушка при низкой температуре. Не отбеливать.", careUz: "Nozik rejimda sovuq suvda yuvish. Past haroratda quritish. Oqartirmang.", sizes: "S,M,L,XL", colors: "Cream,Beige,White", images: "bathrobe-1", featured: true },
  { id: 2, categoryId: 1, slug: "spa-bathrobe", nameEn: "Spa Luxury Bathrobe", nameRu: "Спа-халат люкс", nameUz: "Spa hashamat xalati", descriptionEn: "Premium spa bathrobe in soft pastel tones. Designed for ultimate comfort and relaxation.", descriptionRu: "Премиальный спа-халат в мягких пастельных тонах. Создан для максимального комфорта и расслабления.", descriptionUz: "Yumshoq pastel ranglardagi premium spa xalati. Maksimal qulaylik uchun yaratilgan.", materialEn: "100% Organic Cotton, 500 GSM luxury weight, shawl collar design", materialRu: "100% Органический хлопок, плотность 500 г/м² люкс, воротник-шаль", materialUz: "100% Organik paxta, 500 GSM hashamat og'irligi, shol yoqali dizayn", careEn: "Machine wash cold. Tumble dry low. Remove promptly to reduce wrinkles.", careRu: "Машинная стирка в холодной воде. Сушка при низкой температуре.", careUz: "Sovuq suvda yuvish. Past haroratda quritish.", sizes: "S,M,L,XL,XXL", colors: "Light Pink,Mint,Lavender", images: "bathrobe-2", featured: true },
  { id: 3, categoryId: 1, slug: "velour-bathrobe", nameEn: "Velour Touch Bathrobe", nameRu: "Велюровый халат", nameUz: "Velur xalat", descriptionEn: "Ultra-soft velour bathrobe for the ultimate in luxury and comfort.", descriptionRu: "Ультрамягкий велюровый халат для максимальной роскоши и комфорта.", descriptionUz: "O'ta yumshoq velur xalat - eng yuqori darajadagi hashamat va qulaylik uchun.", materialEn: "Cotton Velour Blend, 450 GSM, plush texture exterior, terry interior", materialRu: "Хлопковый велюр, плотность 450 г/м², плюшевая текстура снаружи, махра внутри", materialUz: "Paxta velur aralashmasi, 450 GSM, tashqi tomondan yumshoq tekstura", careEn: "Gentle cycle, hang dry for best results. Do not iron velour surface.", careRu: "Деликатная стирка, лучше сушить в подвешенном состоянии.", careUz: "Nozik yuvish, osib quritish.", sizes: "M,L,XL", colors: "Taupe,Gray,Ivory", images: "bathrobe-3", featured: false },
  { id: 4, categoryId: 2, slug: "bath-towel-set", nameEn: "Premium Bath Towel Set", nameRu: "Премиум набор банных полотенец", nameUz: "Premium hammom sochiq to'plami", descriptionEn: "Set of luxurious bath towels. Exceptionally soft and highly absorbent for the perfect spa experience at home.", descriptionRu: "Набор роскошных банных полотенец. Исключительно мягкие и очень впитывающие для идеального спа-опыта дома.", descriptionUz: "Hashamatli hammom sochiqlari to'plami. Uyda mukammal spa tajribasi uchun.", materialEn: "100% Long-Staple Cotton, 600 GSM premium weight, zero-twist technology for softness", materialRu: "100% Длинноволокнистый хлопок, плотность 600 г/м², технология zero-twist для мягкости", materialUz: "100% Uzun tolali paxta, 600 GSM premium og'irlik", careEn: "Machine wash warm with like colors. Tumble dry medium. Avoid fabric softeners.", careRu: "Машинная стирка в теплой воде с похожими цветами. Избегайте кондиционеров.", careUz: "Iliq suvda yuvish. O'rtacha haroratda quritish.", sizes: "Standard,Large", colors: "White,Cream,Sand", images: "towel-1", featured: true },
  { id: 5, categoryId: 2, slug: "hand-towels", nameEn: "Elegant Hand Towels", nameRu: "Элегантные полотенца для рук", nameUz: "Nafis qo'l sochiqlari", descriptionEn: "Soft and absorbent hand towels in beautiful pastel colors.", descriptionRu: "Мягкие и впитывающие полотенца для рук в красивых пастельных тонах.", descriptionUz: "Chiroyli pastel ranglardagi yumshoq va singdiruvchi qo'l sochiqlari.", materialEn: "Turkish Cotton, 500 GSM, quick-dry technology", materialRu: "Турецкий хлопок, плотность 500 г/м², технология быстрой сушки", materialUz: "Turk paxtasi, 500 GSM, tez qurish texnologiyasi", careEn: "Machine wash. Tumble dry.", careRu: "Машинная стирка. Сушка в машине.", careUz: "Mashina yuvish. Quritish.", sizes: "Standard", colors: "Blush,Sage,Stone", images: "towel-2", featured: false },
  { id: 6, categoryId: 2, slug: "luxury-towel-collection", nameEn: "Luxury Towel Collection", nameRu: "Коллекция люксовых полотенец", nameUz: "Hashamatli sochiqlar kolleksiyasi", descriptionEn: "Complete luxury bathroom towel set including bath, hand, and face towels.", descriptionRu: "Полный набор роскошных полотенец для ванной: банные, для рук и для лица.", descriptionUz: "To'liq hashamatli hammom sochiq to'plami: hammom, qo'l va yuz sochiqlari.", materialEn: "Zero-Twist Cotton, 650 GSM ultra-premium weight, reinforced edges", materialRu: "Хлопок Zero-Twist, ультра-премиальная плотность 650 г/м², усиленные края", materialUz: "Zero-Twist paxta, 650 GSM ultra-premium og'irlik", careEn: "Machine wash cold or warm. Tumble dry low to medium.", careRu: "Машинная стирка холодной или теплой водой.", careUz: "Sovuq yoki iliq suvda yuvish.", sizes: "Set of 6", colors: "Natural,Oatmeal,Pearl", images: "towel-3", featured: true },
];

export default function ProductPage() {
  const t = useTranslations();
  const { language } = useLanguageStore();
  const params = useParams<{ slug: string }>();

  const { data: products = defaultProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const product = products.find((p) => p.slug === params.slug);

  if (isLoading) {
    return (
      <div className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Link href="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sizes = product.sizes?.split(",") || [];
  const colors = product.colors?.split(",") || [];

  return (
    <div className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-body text-sm">{t.catalog.title}</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={productImages[product.images || ""] || productBathrobe1}
                alt={getLocalizedField(product, "name", language)}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              {product.featured && (
                <Badge className="mb-3">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <h1
                className="text-3xl sm:text-4xl font-semibold mb-4"
                data-testid="text-product-title"
              >
                {getLocalizedField(product, "name", language)}
              </h1>
              <p
                className="text-body text-lg text-muted-foreground leading-relaxed"
                data-testid="text-product-description"
              >
                {getLocalizedField(product, "description", language)}
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {t.product.material}
                  </h3>
                  <p className="text-body" data-testid="text-product-material">
                    {getLocalizedField(product, "material", language)}
                  </p>
                </div>

                {sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {t.product.sizes}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <Badge key={size} variant="outline" data-testid={`badge-size-${size}`}>
                          {size.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {t.product.colors}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <Badge key={color} variant="secondary" data-testid={`badge-color-${color}`}>
                          {color.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {t.product.care}
                  </h3>
                  <p className="text-body text-sm text-muted-foreground" data-testid="text-product-care">
                    {getLocalizedField(product, "care", language)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Link href={`/contact?product=${product.slug}`}>
              <Button size="lg" className="w-full sm:w-auto text-body" data-testid="button-request-quote">
                {t.product.requestQuote}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
