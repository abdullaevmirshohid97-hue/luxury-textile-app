import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n";
import { Building2, ShoppingBag, Factory, Package, Clock, Palette, Award, ArrowRight } from "lucide-react";

import heroLifestyle from "@/assets/images/hero-lifestyle.jpg";

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

export default function Business() {
  const t = useTranslations();

  const sectors = [
    {
      icon: Building2,
      title: t.business.hospitality,
      description: t.business.hospitalityDesc,
    },
    {
      icon: ShoppingBag,
      title: t.business.privateLabel,
      description: t.business.privateLabelDesc,
    },
    {
      icon: Factory,
      title: t.business.contract,
      description: t.business.contractDesc,
    },
  ];

  const capabilities = [
    { icon: Package, label: t.business.moq, value: t.business.moqValue },
    { icon: Clock, label: t.business.leadTime, value: t.business.leadTimeValue },
    { icon: Palette, label: t.business.customization, value: t.business.customizationValue },
    { icon: Award, label: t.business.certifications, value: t.business.certificationsValue },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroLifestyle}
            alt="Mary Collection Manufacturing"
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
              B2B
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6"
              data-testid="text-business-title"
            >
              {t.business.title}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/80 font-light leading-relaxed mb-8"
              data-testid="text-business-subtitle"
            >
              {t.business.heroText}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/contact">
                <Button size="lg" className="min-w-[200px] h-14 rounded-none uppercase tracking-widest text-xs font-semibold bg-white text-black hover:bg-white/90" data-testid="button-business-inquiry">
                  {t.business.ctaButton}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
              {t.business.sectors}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              {t.business.subtitle}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mb-6">
                      <sector.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{sector.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {sector.description}
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
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
              {t.business.capabilities}
            </span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="p-4 rounded-full bg-white w-fit mx-auto mb-4 shadow-sm">
                  <cap.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{cap.label}</p>
                <p className="text-lg font-semibold">{cap.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
              {t.business.ctaTitle}
            </h2>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="min-w-[200px] h-14 rounded-none uppercase tracking-widest text-xs font-semibold border-white text-white hover:bg-white hover:text-primary" data-testid="button-business-cta">
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
