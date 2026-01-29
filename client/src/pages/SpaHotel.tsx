import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Building2, Sparkles, ShieldCheck, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore, getLocalizedField } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

export default function SpaHotel() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const spaCategory = categories.find((c) => c.slug === "spa-hotel");
  const spaProducts = products.filter((p) => spaCategory && p.categoryId === spaCategory.id);

  const benefits = [
    { icon: ShieldCheck, text: t.spaHotel.benefit1 },
    { icon: Truck, text: t.spaHotel.benefit2 },
    { icon: Sparkles, text: t.spaHotel.benefit3 },
    { icon: Users, text: t.spaHotel.benefit4 },
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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">B2B</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-page-title">
              {t.spaHotel.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t.spaHotel.heroText}
            </p>
            <Link href="/bulk-order">
              <Button size="lg" data-testid="button-request-quote-hero">
                {t.spaHotel.requestQuote}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-10">{t.spaHotel.benefits}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">{benefit.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-10">{t.spaHotel.products}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <div className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-primary/30" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg mb-2">{t.spaHotel.bathrobes}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "ru" ? "Профессиональные халаты для отелей премиум-класса" : 
                     language === "uz" ? "Premium mehmonxonalar uchun professional xalatlar" :
                     "Professional bathrobes for premium hotels"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-primary/30" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg mb-2">{t.spaHotel.towels}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "ru" ? "Полотенца для спа-процедур и ванных комнат" : 
                     language === "uz" ? "Spa muolajalar va hammomlar uchun sochiqlar" :
                     "Towels for spa treatments and bathrooms"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary/30" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg mb-2">{t.spaHotel.slippers}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "ru" ? "Удобные тапочки для гостей" : 
                     language === "uz" ? "Mehmonlar uchun qulay shippaklar" :
                     "Comfortable slippers for guests"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {spaProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-serif text-center mb-6">{t.catalog.title}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {spaProducts.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/product/${product.slug}`}>
                      <Card className="hover-elevate cursor-pointer" data-testid={`card-spa-product-${product.id}`}>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-1 line-clamp-1">
                            {getLocalizedField(product, "name", language)}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getLocalizedField(product, "description", language)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">{t.spaHotel.partnerWith}</p>
            <Link href="/bulk-order">
              <Button size="lg" data-testid="button-bulk-order-cta">
                {t.spaHotel.requestQuote}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
