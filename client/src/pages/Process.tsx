import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { MessageSquare, FileText, FlaskConical, TestTube, Factory, PackageCheck, ArrowRight } from "lucide-react";
import type { ProcessStep } from "@shared/schema";

import cottonQuality from "@/assets/images/cotton-quality.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  FileText,
  FlaskConical,
  TestTube,
  Factory,
  PackageCheck,
};

function getLocalizedText(step: ProcessStep, field: 'title' | 'description', lang: string): string {
  const fieldMap = {
    title: { uz: step.titleUz, ru: step.titleRu, en: step.titleEn },
    description: { uz: step.descriptionUz, ru: step.descriptionRu, en: step.descriptionEn },
  };
  return fieldMap[field][lang as keyof typeof fieldMap.title] || fieldMap[field].en;
}

export default function Process() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const { data: processSteps, isLoading, isError } = useQuery<ProcessStep[]>({
    queryKey: ["/api/content/process-steps"],
  });

  const sortedSteps = processSteps?.filter(s => s.enabled).slice().sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="flex flex-col">
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cottonQuality}
            alt="Mary Collection Manufacturing Process"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-3xl text-white">
            <motion.span
              variants={fadeInUp}
              className="text-xs uppercase tracking-[0.3em] font-medium text-white/70 mb-4 block"
            >
              {t.process.title}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6"
              data-testid="text-process-title"
            >
              {t.process.subtitle}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/80 font-light leading-relaxed"
              data-testid="text-process-subtitle"
            >
              {t.process.heroText}
            </motion.p>
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-8">
                    <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
                    <Skeleton className="flex-1 h-32" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Unable to load process steps. Please try again later.
                </CardContent>
              </Card>
            ) : sortedSteps.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No process steps available.
                </CardContent>
              </Card>
            ) : (
              sortedSteps.map((step, index) => {
                const IconComponent = iconMap[step.icon] || MessageSquare;
                const stepNumber = String(index + 1).padStart(2, '0');
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex gap-8 mb-12 last:mb-0 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex-shrink-0 w-20">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{stepNumber}</span>
                      </div>
                      {index < sortedSteps.length - 1 && (
                        <div className="w-0.5 h-12 bg-primary/20 mx-auto mt-4" />
                      )}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">{getLocalizedText(step, 'title', language)}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {getLocalizedText(step, 'description', language)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              {t.process.qualityTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t.process.qualityDesc}
            </p>
            <Link href="/contact">
              <Button size="lg" className="min-w-[200px] rounded-none uppercase tracking-widest text-xs font-semibold" data-testid="button-process-cta">
                {t.business.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              {t.business.responseTime}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
