import { Link } from "wouter";
import { motion } from "framer-motion";
import { Globe, Package, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { GLOBAL_CONTACT } from "@shared/globalConfig";

export default function ExportEurope() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const reasons = [
    { icon: Star, text: t.export.reason1 },
    { icon: Package, text: t.export.reason2 },
    { icon: Shield, text: t.export.reason3 },
    { icon: Truck, text: t.export.reason4 },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-24 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{t.export.title}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-page-title">
              {t.export.europe}
            </h1>
            <p className="text-lg text-blue-200 mb-8">
              {language === "ru" ? "Премиальный узбекский текстиль для европейского рынка" : 
               language === "uz" ? "Yevropa bozori uchun premium O'zbek tekstili" :
               "Premium Uzbek textiles for the European market"}
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" data-testid="button-contact-export">
                {t.export.contactExport}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-10">{t.export.whyUzbekistan}</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6 bg-blue-50 border-blue-200">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-medium">{reason.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardContent className="text-center">
                <h3 className="text-xl font-serif mb-4">
                  {language === "ru" ? "Экспорт в Европу" : 
                   language === "uz" ? "Yevropaga eksport" :
                   "Export to Europe"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "ru" ? "Германия, Франция, Италия, Великобритания, Испания, Нидерланды" : 
                   language === "uz" ? "Germaniya, Fransiya, Italiya, Buyuk Britaniya, Ispaniya, Niderlandiya" :
                   "Germany, France, Italy, United Kingdom, Spain, Netherlands"}
                </p>
                <div className="space-y-2">
                  <p className="font-medium">{GLOBAL_CONTACT.phone}</p>
                  <p className="text-sm text-muted-foreground">{GLOBAL_CONTACT.email}</p>
                </div>
                <Link href="/contact">
                  <Button size="lg" className="mt-6" data-testid="button-contact-cta">
                    {t.export.contactExport}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
