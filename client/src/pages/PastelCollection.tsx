import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Gift, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore, getLocalizedField } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

export default function PastelCollection() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const pastelCategory = categories.find((c) => c.slug === "pastel");
  const pastelProducts = products.filter((p) => pastelCategory && p.categoryId === pastelCategory.id);

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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">{t.pastel.perfectGift}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-page-title">
              {t.pastel.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t.pastel.heroText}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">{t.pastel.giftBox}</h3>
              <p className="text-muted-foreground text-sm">{t.pastel.giftDesc}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">{t.home.pastelElegance}</h3>
              <p className="text-muted-foreground text-sm">{t.home.pastelEleganceDesc}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">{t.home.craftmanship}</h3>
              <p className="text-muted-foreground text-sm">{t.home.craftmanshipDesc}</p>
            </motion.div>
          </div>

          <h2 className="text-2xl font-serif text-center mb-10">{t.pastel.viewCollection}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastelProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/product/${product.slug}`}>
                  <Card className="hover-elevate cursor-pointer overflow-hidden" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                      <Gift className="h-16 w-16 text-primary/30" />
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

          {pastelProducts.length === 0 && (
            <div className="text-center py-16">
              <Gift className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
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
              <Button size="lg" data-testid="button-contact-pastel">
                {t.product.requestQuote}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
