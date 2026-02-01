import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n";
import { Leaf, Factory, Droplets, Scissors, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";

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

export default function Process() {
  const t = useTranslations();

  const steps = [
    { icon: Leaf, title: t.process.step1Title, description: t.process.step1Desc, step: "01" },
    { icon: Factory, title: t.process.step2Title, description: t.process.step2Desc, step: "02" },
    { icon: Factory, title: t.process.step3Title, description: t.process.step3Desc, step: "03" },
    { icon: Droplets, title: t.process.step4Title, description: t.process.step4Desc, step: "04" },
    { icon: Scissors, title: t.process.step5Title, description: t.process.step5Desc, step: "05" },
    { icon: ShieldCheck, title: t.process.step6Title, description: t.process.step6Desc, step: "06" },
  ];

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
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex gap-8 mb-16 last:mb-0 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0 w-20">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{step.step}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-primary/20 mx-auto mt-4" />
                  )}
                </div>
                <Card className="flex-1">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <step.icon className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            className="max-w-3xl mx-auto text-center"
          >
            <div className="p-4 rounded-full bg-white w-fit mx-auto mb-6 shadow-sm">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
              {t.process.qualityTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t.process.qualityDesc}
            </p>
            <Link href="/contact">
              <Button size="lg" className="min-w-[200px] h-14 rounded-none uppercase tracking-widest text-xs font-semibold" data-testid="button-process-cta">
                {t.business.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
