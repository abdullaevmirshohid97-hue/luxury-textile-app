import { motion } from "framer-motion";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2, Hotel, Sparkles, Wind } from "lucide-react";

export default function SpaCollection() {
  const t = useTranslations();
  
  const heroImage = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2000";
  
  // Spa specific translations would ideally be in i18n.ts, 
  // but for Quick Edit we'll define some local ones or use existing ones where appropriate
  // I will add them to i18n.ts in the next step
  
  const spaFeatures = [
    {
      icon: <Hotel className="h-6 w-6" />,
      title: {
        en: "Hospitality Grade",
        ru: "Отельный стандарт",
        uz: "Mehmonxona standarti"
      },
      desc: {
        en: "Designed to withstand frequent industrial laundering while maintaining softness.",
        ru: "Выдерживает частую промышленную стирку, сохраняя мягкость.",
        uz: "Yumshoqlikni saqlab qolgan holda tez-tez sanoat yuvishga bardosh beradi."
      }
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: {
        en: "Premium Wellness",
        ru: "Премиальный велнес",
        uz: "Premium wellness"
      },
      desc: {
        en: "Extra-long staple cotton for maximum absorbency and a cloud-like feel.",
        ru: "Длинноволокнистый хлопок для максимальной впитываемости и ощущения легкости.",
        uz: "Maksimal namlikni yutish va bulutdek yengillik uchun uzun tolali paxta."
      }
    },
    {
      icon: <Wind className="h-6 w-6" />,
      title: {
        en: "Breathable Luxury",
        ru: "Дышащая роскошь",
        uz: "Nafas oluvchi hashamat"
      },
      desc: {
        en: "Lightweight yet plush construction perfect for relaxation environments.",
        ru: "Легкая, но пышная структура, идеально подходящая для зон отдыха.",
        uz: "Dam olish zonalari uchun mukammal bo'lgan yengil va yumshoq tuzilish."
      }
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
        
        <div className="container relative z-10 px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="uppercase tracking-[0.3em] text-sm mb-4 block font-light">
              Mary Collection
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair mb-6">
              Spa & Hospitality
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-light opacity-90 leading-relaxed mb-8">
              Elevating the guest experience with textiles designed for world-class wellness centers and premium resorts.
            </p>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-10 h-14 uppercase tracking-widest text-xs" asChild>
              <Link href="/contact">Inquire Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Description */}
      <section className="py-24 bg-[#F9F7F2]">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair mb-8 text-[#4A4238]">The Art of Relaxation</h2>
            <p className="text-lg text-[#6B6358] leading-relaxed mb-12 italic">
              "We believe that true luxury is felt. For spa hotels and wellness centers, the touch of a robe or a towel is often the most intimate interaction a guest has with the brand. Mary Collection ensures that interaction is one of pure, unadulterated comfort."
            </p>
            <div className="grid md:grid-cols-3 gap-12">
              {spaFeatures.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="mb-4 text-[#8C7E6C]">{feature.icon}</div>
                  <h3 className="font-semibold text-[#4A4238] mb-2">
                    {/* @ts-ignore */}
                    {feature.title[t.nav.home === "Home" ? "en" : t.nav.home === "Главная" ? "ru" : "uz"]}
                  </h3>
                  <p className="text-sm text-[#8C7E6C]">
                    {/* @ts-ignore */}
                    {feature.desc[t.nav.home === "Home" ? "en" : t.nav.home === "Главная" ? "ru" : "uz"]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Presentation */}
      <section className="py-24 bg-white">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#8C7E6C] mb-4">Dedicated Support</h3>
              <h2 className="text-3xl md:text-5xl font-playfair mb-6 text-[#4A4238]">Bespoke Solutions for Your Property</h2>
              <p className="text-[#6B6358] mb-8 leading-relaxed">
                Whether you are managing a boutique spa or a large-scale international resort, our team provides personalized consulting to select the perfect weight, weave, and color palette for your brand.
              </p>
              <ul className="space-y-4 mb-10">
                {["Custom logo embroidery available", "Bulk pricing for hospitality partners", "Sustainable production certificates", "Dedicated account management"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#6B6358]">
                    <CheckCircle2 className="h-5 w-5 text-[#8C7E6C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="rounded-none bg-[#4A4238] hover:bg-[#5E5448] text-white px-8 h-12 uppercase tracking-widest text-xs" asChild>
                <Link href="/contact">Download Brochure</Link>
              </Button>
            </motion.div>
            <div className="relative aspect-[4/5] bg-[#EAE7E1] overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000" 
                alt="Spa Luxury" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#4A4238] text-white text-center">
        <div className="container px-4">
          <h2 className="text-3xl md:text-5xl font-playfair mb-8">Partner with Mary Collection</h2>
          <p className="max-w-2xl mx-auto opacity-80 mb-12">
            Elevate your wellness experience with our premium hospitality range. Contact our corporate sales department for a custom quote and samples.
          </p>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-12 h-14 uppercase tracking-widest text-xs" asChild>
            <Link href="/contact">Get a Custom Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
