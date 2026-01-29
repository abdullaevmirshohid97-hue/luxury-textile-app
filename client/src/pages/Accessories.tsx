import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footprints, Package, Gift, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore, getLocalizedField } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

export default function Accessories() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const accessoriesCategory = categories.find((c) => c.slug === "accessories");
  const accessoryProducts = products.filter((p) => accessoriesCategory && p.categoryId === accessoriesCategory.id);

  const accessoryTypes = [
    { icon: Footprints, title: t.accessories.slippers, color: "bg-amber-100" },
    { icon: Package, title: t.accessories.towelSets, color: "bg-blue-100" },
    { icon: Gift, title: t.accessories.giftBoxes, color: "bg-pink-100" },
    { icon: ShoppingBag, title: t.accessories.storageBags, color: "bg-green-100" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-page-title">
              {t.accessories.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t.accessories.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {accessoryTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover-elevate cursor-pointer" data-testid={`card-accessory-type-${index}`}>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto mb-4`}>
                      <type.icon className="h-8 w-8 text-foreground/70" />
                    </div>
                    <h3 className="font-serif text-lg">{type.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-serif text-center mb-10">{t.accessories.viewAll}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/product/${product.slug}`}>
                  <Card className="hover-elevate cursor-pointer overflow-hidden" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                      <Package className="h-16 w-16 text-primary/30" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-serif text-lg mb-1">
                        {getLocalizedField(product, "name", language)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {getLocalizedField(product, "description", language)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {accessoryProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.catalog.subtitle}</p>
              <Link href="/catalog">
                <Button variant="outline" className="mt-4" data-testid="button-view-catalog">
                  {t.home.shopCollection}
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" data-testid="button-contact-accessories">
                {t.product.requestQuote}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
