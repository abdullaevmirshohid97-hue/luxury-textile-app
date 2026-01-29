import { Link } from "wouter";
import { motion } from "framer-motion";
import { Globe, Package, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { GLOBAL_CONTACT } from "@shared/globalConfig";

export default function ExportMiddleEast() {
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
      <section className="relative py-24 bg-gradient-to-b from-amber-900 to-amber-800 text-white">
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
              {t.export.middleEast}
            </h1>
            <p className="text-lg text-amber-200 mb-8">
              {language === "ru" ? "Премиальный узбекский текстиль для рынка Ближнего Востока" : 
               language === "uz" ? "Yaqin Sharq bozori uchun premium O'zbek tekstili" :
               "Premium Uzbek textiles for the Middle East market"}
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
                <Card className="h-full text-center p-6 bg-amber-50 border-amber-200">
                  <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center mx-auto mb-4">
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
                  {language === "ru" ? "Экспорт в страны региона" : 
                   language === "uz" ? "Mintaqa mamlakatlariga eksport" :
                   "Export to regional countries"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "ru" ? "ОАЭ, Саудовская Аравия, Катар, Кувейт, Бахрейн, Оман" : 
                   language === "uz" ? "BAA, Saudiya Arabistoni, Qatar, Quvayt, Bahrayn, Ummon" :
                   "UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman"}
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
