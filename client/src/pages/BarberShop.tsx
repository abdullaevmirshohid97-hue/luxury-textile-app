import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Scissors, Droplets, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore, getLocalizedField } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

export default function BarberShop() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const barberCategory = categories.find((c) => c.slug === "barber");
  const barberProducts = products.filter((p) => barberCategory && p.categoryId === barberCategory.id);

  const benefits = [
    { icon: Droplets, text: t.barber.benefit1 },
    { icon: Shield, text: t.barber.benefit2 },
    { icon: Scissors, text: t.barber.benefit3 },
    { icon: Palette, text: t.barber.benefit4 },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-24 bg-gradient-to-b from-stone-900 to-stone-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6">
              <Scissors className="h-4 w-4" />
              <span className="text-sm font-medium">B2B</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-page-title">
              {t.barber.title}
            </h1>
            <p className="text-lg text-stone-300 mb-8">
              {t.barber.heroText}
            </p>
            <Link href="/bulk-order">
              <Button size="lg" variant="secondary" data-testid="button-request-quote-hero">
                {t.barber.requestQuote}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-10">{t.barber.benefits}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6 bg-stone-50 border-stone-200">
                  <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-medium">{benefit.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-10">{t.barber.products}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-stone-900 text-white border-stone-800">
                <div className="aspect-video bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center">
                  <Droplets className="h-16 w-16 text-stone-500" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg mb-2">{t.barber.towels}</h3>
                  <p className="text-sm text-stone-400">
                    {language === "ru" ? "Быстросохнущие полотенца для профессионального использования" : 
                     language === "uz" ? "Professional foydalanish uchun tez quriydigan sochiqlar" :
                     "Quick-dry towels for professional use"}
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
              <Card className="h-full bg-stone-900 text-white border-stone-800">
                <div className="aspect-video bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center">
                  <Scissors className="h-16 w-16 text-stone-500" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg mb-2">{t.barber.capes}</h3>
                  <p className="text-sm text-stone-400">
                    {language === "ru" ? "Стильные накидки для стрижки" : 
                     language === "uz" ? "Zamonaviy soch olish pelerinlari" :
                     "Stylish cutting capes"}
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
              <Card className="h-full bg-stone-900 text-white border-stone-800">
                <div className="aspect-video bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center">
                  <Shield className="h-16 w-16 text-stone-500" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg mb-2">{t.barber.sets}</h3>
                  <p className="text-sm text-stone-400">
                    {language === "ru" ? "Комплекты для оснащения барбершопа" : 
                     language === "uz" ? "Sartaroshxonani jihozlash uchun to'plamlar" :
                     "Complete barber shop equipment sets"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {barberProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-serif text-center mb-6">{t.catalog.title}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {barberProducts.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/product/${product.slug}`}>
                      <Card className="hover-elevate cursor-pointer" data-testid={`card-barber-product-${product.id}`}>
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
            <Link href="/bulk-order">
              <Button size="lg" data-testid="button-bulk-order-cta">
                {t.barber.requestQuote}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
