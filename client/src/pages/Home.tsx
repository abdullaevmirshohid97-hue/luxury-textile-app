import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n";
import { Sparkles, Leaf, Award, Heart } from "lucide-react";

import heroLifestyle from "@/assets/images/hero-lifestyle.jpg";
import heroBathrobe from "@/assets/images/hero-bathrobe.jpg";
import heroTowels from "@/assets/images/hero-towels.jpg";
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

export default function Home() {
  const t = useTranslations();

  const features = [
    {
      icon: Sparkles,
      title: t.home.premiumCotton,
      description: t.home.premiumCottonDesc,
    },
    {
      icon: Leaf,
      title: t.home.pastelElegance,
      description: t.home.pastelEleganceDesc,
    },
    {
      icon: Award,
      title: t.home.exportQuality,
      description: t.home.exportQualityDesc,
    },
    {
      icon: Heart,
      title: t.home.craftmanship,
      description: t.home.craftmanshipDesc,
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroLifestyle}
            alt="Luxury bathroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-2xl text-white">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6"
              data-testid="text-hero-title"
            >
              {t.home.heroTitle}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-white/90 mb-8 text-body"
              data-testid="text-hero-subtitle"
            >
              {t.home.heroSubtitle}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/catalog">
                <Button size="lg" className="text-body" data-testid="button-shop-collection">
                  {t.home.shopCollection}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-body bg-white/10 border-white/30 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-contact-us"
                >
                  {t.home.contactUs}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 lg:py-28 luxury-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6" data-testid="text-philosophy-title">
                {t.home.philosophy}
              </h2>
              <p className="text-body text-muted-foreground text-lg leading-relaxed" data-testid="text-philosophy-content">
                {t.home.philosophyText}
              </p>
            </div>
            <div className="relative">
              <img
                src={cottonQuality}
                alt="Premium cotton"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-featured-title">
              {t.home.featuredCollections}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/catalog?category=bathrobes">
                <Card className="group cursor-pointer overflow-hidden hover-elevate">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={heroBathrobe}
                      alt="Bathrobes collection"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2" data-testid="text-collection-bathrobes">
                      {t.home.bathrobesCollection}
                    </h3>
                    <p className="text-body text-muted-foreground">
                      {t.home.bathrobesDesc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/catalog?category=towels">
                <Card className="group cursor-pointer overflow-hidden hover-elevate">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={heroTowels}
                      alt="Towels collection"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2" data-testid="text-collection-towels">
                      {t.home.towelsCollection}
                    </h3>
                    <p className="text-body text-muted-foreground">
                      {t.home.towelsDesc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold" data-testid="text-whyus-title">
              {t.home.whyUs}
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-body text-sm text-muted-foreground" data-testid={`text-feature-desc-${index}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
              {t.contact.title}
            </h2>
            <p className="text-body text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-body" data-testid="button-cta-contact">
                {t.home.contactUs}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
