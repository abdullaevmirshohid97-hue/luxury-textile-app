import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n";
import { Sparkles, Leaf, Award, Heart, Mail, Phone, MapPin, Building2, Waves, ShoppingBag, Globe2, ShieldCheck, Factory } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";

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

  const useCases = [
    {
      icon: Building2,
      title: "Luxury Hospitality",
      description: "Custom-branded linens and bathrobes for 5-star hotels and boutique resorts worldwide.",
    },
    {
      icon: Waves,
      title: "Premium Spas & Wellness",
      description: "Ultra-absorbent, soft-touch towels designed for the most demanding spa environments.",
    },
    {
      icon: ShoppingBag,
      title: "Exclusive Retailers",
      description: "Curated collections for high-end home decor boutiques and luxury department stores.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroLifestyle}
            alt="Luxury home textiles"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-3xl text-white">
            <motion.div variants={fadeInUp} className="mb-4 inline-block">
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/70">Heritage of Excellence</span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-8"
              data-testid="text-hero-title"
            >
              The Art of <br />
              <span className="text-white/80">Luxury Textiles</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-white/80 mb-12 max-w-xl font-light leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              Exquisite cotton collections for world-class hotels, spas, and exclusive retail partners. 
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
              <Link href="/catalog">
                <Button size="lg" className="min-w-[200px] h-14 rounded-none uppercase tracking-widest text-xs font-semibold bg-white text-black hover:bg-white/90" data-testid="button-shop-collection">
                  Explore Collections
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] h-14 rounded-none uppercase tracking-widest text-xs font-semibold bg-white/5 border-white/30 text-white backdrop-blur-md hover:bg-white/10"
                  data-testid="button-wholesale-offer"
                >
                  Request Wholesale Offer
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 lg:py-32 luxury-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">Our Legacy</span>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-8 leading-tight" data-testid="text-philosophy-title">
                {t.home.philosophy}
              </h2>
              <p className="text-body text-muted-foreground text-xl leading-relaxed font-light italic mb-8">
                "Where Uzbekistan's cotton heritage meets Italian-inspired design standards."
              </p>
              <p className="text-body text-muted-foreground text-lg leading-relaxed" data-testid="text-philosophy-content">
                {t.home.philosophyText}
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 border border-primary/10 rounded-lg -z-10 group-hover:scale-105 transition-transform duration-700" />
              <img
                src={cottonQuality}
                alt="Premium cotton fibers"
                className="w-full rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Collections Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">Seasonal Series</span>
            <h2 className="text-4xl sm:text-5xl font-semibold mb-6" data-testid="text-featured-title">
              Latest Collections
            </h2>
            <div className="w-24 h-px bg-primary/20 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/catalog?category=bathrobes">
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                    <img
                      src={heroBathrobe}
                      alt="The Silk-Cotton Series"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-light tracking-wide mb-3" data-testid="text-collection-bathrobes">
                    The Silk-Cotton Series
                  </h3>
                  <p className="text-body text-muted-foreground font-light mb-4">
                    Signature bathrobes blending premium long-staple cotton with refined aesthetics for unparalleled comfort.
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium border-b border-primary/20 pb-1 group-hover:border-primary transition-colors">Discover Series</span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/catalog?category=towels">
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                    <img
                      src={heroTowels}
                      alt="The Cloud-Touch Towel Series"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-light tracking-wide mb-3" data-testid="text-collection-towels">
                    The Artisan Towel Series
                  </h3>
                  <p className="text-body text-muted-foreground font-light mb-4">
                    High-density weave towels designed for rapid absorption and enduring softness, preferred by luxury spas.
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium border-b border-primary/20 pb-1 group-hover:border-primary transition-colors">Discover Series</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Use Cases */}
      <section className="py-24 lg:py-32 bg-[#F9F7F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">B2B Solutions</span>
            <h2 className="text-4xl font-semibold mb-4">Professional Excellence</h2>
            <p className="text-muted-foreground font-light">Tailored textile solutions for prestigious partners.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="mb-6 overflow-hidden">
                   <useCase.icon className="w-10 h-10 text-primary/40 group-hover:text-primary transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-medium mb-4 tracking-tight">{useCase.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* International Credibility & Trust */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-y border-primary/5 py-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <Globe2 className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">Global Export</h4>
              <p className="text-xs text-muted-foreground font-light">Serving markets across EU, USA, and CIS.</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">Quality Assurance</h4>
              <p className="text-xs text-muted-foreground font-light">OEKO-TEX® certified manufacturing.</p>
            </div>
            <div className="text-center">
              <Factory className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">Direct Supply</h4>
              <p className="text-xs text-muted-foreground font-light">Factory-direct pricing and logistics.</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">Custom Branding</h4>
              <p className="text-xs text-muted-foreground font-light">Bespoke embroidery and packaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 lg:py-32 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold uppercase tracking-widest" data-testid="text-whyus-title">
              {t.home.whyUs}
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 mb-6 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary/60" />
                </div>
                <h3 className="text-lg font-medium mb-3 tracking-wide" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-body text-sm text-muted-foreground font-light leading-relaxed" data-testid={`text-feature-desc-${index}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-32 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-semibold mb-6">
              {t.contact.title}
            </h2>
            <p className="text-body text-muted-foreground text-lg max-w-2xl mx-auto font-light">
              Connect with our international export department for wholesale inquiries and custom orders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/5 hover-elevate rounded-none shadow-none">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-5 w-5 text-primary/60" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-3">{t.contact.email}</h3>
                <a 
                  href="mailto:Marycollection.uz@gmail.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block break-all font-light"
                >
                  Marycollection.uz@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/5 hover-elevate rounded-none shadow-none">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-5 w-5 text-primary/60" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-3">{t.contact.phone}</h3>
                <a 
                  href="tel:+998882599444" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block font-light"
                >
                  +998 88 259 94 44
                </a>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/5 hover-elevate rounded-none shadow-none">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/5 flex items-center justify-center mx-auto mb-6">
                  <SiWhatsapp className="h-5 w-5 text-green-600/60" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-3">WhatsApp</h3>
                <a 
                  href="https://wa.me/998882599444" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-green-600 transition-colors font-light"
                >
                  +998 88 259 94 44
                </a>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/5 hover-elevate rounded-none shadow-none">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-5 w-5 text-primary/60" />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-3">{t.contact.address}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {t.home.address}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20 text-center">
            <Link href="/contact">
              <Button size="lg" className="rounded-none px-16 h-14 uppercase tracking-[0.3em] text-[10px] font-bold">
                Request a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
