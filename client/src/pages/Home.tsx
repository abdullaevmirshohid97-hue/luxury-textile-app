import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { Sparkles, Leaf, Award, Heart, Mail, Phone, MapPin, Building2, Waves, ShoppingBag, Globe2, ShieldCheck, Factory, TrendingUp } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import type { Product } from "@shared/schema";

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
  const language = useLanguageStore(state => state.language);

  // Fetch trending products based on analytics
  const { data: trendingProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products/trending', { limit: 4 }],
  });

  const getLocalizedName = (product: Product) => {
    if (language === 'uz') return product.nameUz;
    if (language === 'ru') return product.nameRu;
    return product.nameEn;
  };

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
      title: language === 'uz' ? "Ip Yigirish" : 
             language === 'ru' ? "Прядение" : 
             "Yarn Spinning",
      description: language === 'uz' ? "O'zbekiston uzun shtapelli paxtasidan ip ishlab chiqarish. Ichki sifat nazorati." : 
                   language === 'ru' ? "Производство пряжи из узбекского длинноволокнистого хлопка. Внутренний контроль качества." : 
                   "Yarn production from Uzbek long-staple cotton. In-house quality control.",
    },
    {
      icon: Waves,
      title: language === 'uz' ? "Bo'yash va Pardozlash" : 
             language === 'ru' ? "Крашение и Отделка" : 
             "Dyeing & Finishing",
      description: language === 'uz' ? "OEKO-TEX sertifikatlangan bo'yoqlar. 200+ yuvish sinovidan o'tgan rang barqarorligi." : 
                   language === 'ru' ? "Красители с сертификацией OEKO-TEX. Устойчивость цвета проверена 200+ стирками." : 
                   "OEKO-TEX certified dyes. Color fastness tested through 200+ washes.",
    },
    {
      icon: ShoppingBag,
      title: language === 'uz' ? "Dizayn va Tikish" : 
             language === 'ru' ? "Дизайн и Пошив" : 
             "Design & Sewing",
      description: language === 'uz' ? "Ichki dizayn jamoasi. Sanoat tikuv liniyalari. Ommaviy va maxsus buyurtmalar." : 
                   language === 'ru' ? "Собственная дизайн-команда. Промышленные швейные линии. Массовые и кастомные заказы." : 
                   "In-house design team. Industrial sewing lines. Volume and custom orders.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroLifestyle}
            alt="Mary Collection Manufacturing"
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
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/70 border border-white/30 px-3 py-1">
                {language === 'uz' ? 'To\'liq Tsikl Ishlab Chiqaruvchi' : 
                 language === 'ru' ? 'Производитель Полного Цикла' : 
                 'Full-Cycle Manufacturer'}
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-6"
              data-testid="text-hero-title"
            >
              {language === 'uz' ? <>Ip → Bo'yash → Dizayn → <br /> <span className="text-white/80">Tayyor Mahsulot</span></> : 
               language === 'ru' ? <>Пряжа → Крашение → Дизайн → <br /> <span className="text-white/80">Готовый Продукт</span></> : 
               <>Yarn → Dyeing → Design → <br /> <span className="text-white/80">Finished Product</span></>}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-white/80 mb-6 max-w-xl font-light leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              {language === 'uz' ? 'Mehmonxonalar, chakana brendlar va B2B xaridorlar uchun to\'liq nazorat ostida tekstil ishlab chiqarish. Barcha bosqichlar bir tom ostida.' : 
               language === 'ru' ? 'Текстильное производство под полным контролем для отелей, розничных брендов и B2B-покупателей. Все этапы под одной крышей.' : 
               'Textile manufacturing under full control for hotels, retail brands, and B2B buyers. All stages under one roof.'}
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-sm text-white/60 mb-8 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {language === 'uz' ? 'Namunalar majburiyatdan oldin. Sinov buyurtmalari mavjud.' : 
               language === 'ru' ? 'Образцы до обязательств. Пробные заказы доступны.' : 
               'Sampling before commitment. Pilot orders available.'}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
              <Link href="/contact">
                <Button size="lg" className="min-w-[220px] rounded-none uppercase tracking-widest text-xs font-semibold bg-white text-black shadow-lg" data-testid="button-request-consultation">
                  {language === 'uz' ? 'Texnik Maslahat So\'rash' : 
                   language === 'ru' ? 'Запросить Консультацию' : 
                   'Request Technical Consultation'}
                </Button>
              </Link>
              <Link href="/business">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] rounded-none uppercase tracking-widest text-xs font-semibold bg-white/5 border-white/40 text-white backdrop-blur-md"
                  data-testid="button-view-capabilities"
                >
                  {language === 'uz' ? 'Imkoniyatlarni Ko\'rish' : 
                   language === 'ru' ? 'Смотреть Возможности' : 
                   'View Capabilities'}
                </Button>
              </Link>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-xs text-white/50 mt-6"
            >
              {language === 'uz' ? 'Texnik jamoamiz 24–48 soat ichida javob beradi.' : 
               language === 'ru' ? 'Наша техническая команда ответит в течение 24–48 часов.' : 
               'Our technical team responds within 24–48 hours.'}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section - Manufacturing focus */}
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
              <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
                {language === 'uz' ? 'To\'liq Tsikl Ishlab Chiqarish' : 
                 language === 'ru' ? 'Производство Полного Цикла' : 
                 'Full-Cycle Production'}
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-8 leading-tight" data-testid="text-philosophy-title">
                {language === 'uz' ? 'Bir Tom Ostida Nazorat' : 
                 language === 'ru' ? 'Контроль Под Одной Крышей' : 
                 'Control Under One Roof'}
              </h2>
              <div className="space-y-6 text-body text-muted-foreground text-lg leading-relaxed font-light">
                <p>
                  {language === 'uz' ? "Ip yigirish, bo'yash, dizayn va tikish — barcha jarayonlar fabrikamizda. Uchinchi tomon ishtirokisiz to'liq nazorat." : 
                   language === 'ru' ? 'Прядение, крашение, дизайн и пошив — все процессы на нашей фабрике. Полный контроль без участия третьих сторон.' : 
                   'Yarn spinning, dyeing, design, and sewing—all processes in our factory. Full control without third-party involvement.'}
                </p>
                <p>
                  {language === 'uz' ? "200+ sanoat yuvish sinovidan o'tgan. OEKO-TEX va ISO 9001 sertifikatlangan. Sanoat mijozlari uchun barqaror sifat." : 
                   language === 'ru' ? 'Проверено 200+ промышленных стирок. Сертификация OEKO-TEX и ISO 9001. Стабильное качество для промышленных клиентов.' : 
                   'Tested through 200+ industrial washes. OEKO-TEX and ISO 9001 certified. Consistent quality for industrial clients.'}
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 border border-primary/10 rounded-lg -z-10 group-hover:scale-105 transition-transform duration-700" />
              <img
                src={cottonQuality}
                alt="Factory direct production"
                className="w-full rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Segmented User Paths */}
      <section className="py-24 lg:py-32 bg-background border-t border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-0 border border-primary/10">
            {/* Hotels Path */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between hover:bg-primary/[0.02] transition-colors" data-testid="segment-hotels">
              <div>
                <Building2 className="w-10 h-10 mb-8 text-primary/40" />
                <h3 className="text-2xl font-semibold mb-4 tracking-tight" data-testid="text-segment-hotels-title">
                  {language === 'uz' ? 'Mehmonxonalar va Kurortlar' : 
                   language === 'ru' ? 'Отели и Курорты' : 
                   'Hotels & Resorts'}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  {language === 'uz' ? '200+ sanoat yuvish sinovidan o\'tgan tekstil. Xalatlar, sochiqlar, choyshablar.' : 
                   language === 'ru' ? 'Текстиль, проверенный 200+ промышленных стирок. Халаты, полотенца, постельное.' : 
                   'Textiles tested through 200+ industrial washes. Bathrobes, towels, linens.'}
                </p>
                <ul className="text-xs text-muted-foreground/80 space-y-1 mb-8">
                  <li>• {language === 'uz' ? 'Logotip tikish' : language === 'ru' ? 'Вышивка логотипа' : 'Logo embroidery'}</li>
                  <li>• {language === 'uz' ? 'Maxsus ranglar' : language === 'ru' ? 'Кастомные цвета' : 'Custom colors'}</li>
                  <li>• {language === 'uz' ? 'MOQ: 500+ dona' : language === 'ru' ? 'MOQ: 500+ шт.' : 'MOQ: 500+ pcs'}</li>
                </ul>
              </div>
              <Link href="/contact?segment=hospitality">
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] font-bold" data-testid="button-hotel-consultation">
                  {language === 'uz' ? 'Loyiha Konsultatsiyasi' : 
                   language === 'ru' ? 'Консультация по Проекту' : 
                   'Project Consultation'}
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground/60 mt-3 text-center">
                {language === 'uz' ? 'Texnik javob: 24–48 soat' : 
                 language === 'ru' ? 'Технический ответ: 24–48 ч.' : 
                 'Technical response: 24–48 hrs'}
              </p>
            </div>

            {/* Private Label / Retail Path */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between hover:bg-primary/[0.02] transition-colors" data-testid="segment-private-label">
              <div>
                <Factory className="w-10 h-10 mb-8 text-primary/40" />
                <h3 className="text-2xl font-semibold mb-4 tracking-tight" data-testid="text-segment-private-label-title">
                  {language === 'uz' ? 'Xususiy Brend / OEM' : 
                   language === 'ru' ? 'Частная Марка / OEM' : 
                   'Private Label / OEM'}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  {language === 'uz' ? 'To\'liq tsikl ishlab chiqarish sizning brending ostida. Dizayndan tayyor mahsulotgacha.' : 
                   language === 'ru' ? 'Производство полного цикла под вашим брендом. От дизайна до готового продукта.' : 
                   'Full-cycle manufacturing under your brand. From design to finished product.'}
                </p>
                <ul className="text-xs text-muted-foreground/80 space-y-1 mb-8">
                  <li>• {language === 'uz' ? 'Sizning spetsifikatsiyalaringiz' : language === 'ru' ? 'Ваши спецификации' : 'Your specifications'}</li>
                  <li>• {language === 'uz' ? 'Ip, gazlama, mahsulot — barchasi ichki' : language === 'ru' ? 'Пряжа, ткань, изделие — всё внутри' : 'Yarn, fabric, product—all in-house'}</li>
                  <li>• {language === 'uz' ? 'Namuna: 2–3 hafta' : language === 'ru' ? 'Образец: 2–3 недели' : 'Sample: 2–3 weeks'}</li>
                </ul>
              </div>
              <Link href="/contact?segment=retail">
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] font-bold" data-testid="button-oem-consultation">
                  {language === 'uz' ? 'OEM Konsultatsiyasi' : 
                   language === 'ru' ? 'Консультация по OEM' : 
                   'OEM Consultation'}
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground/60 mt-3 text-center">
                {language === 'uz' ? 'Texnik javob: 24–48 soat' : 
                 language === 'ru' ? 'Технический ответ: 24–48 ч.' : 
                 'Technical response: 24–48 hrs'}
              </p>
            </div>

            {/* Bulk B2B Path */}
            <div className="p-12 flex flex-col justify-between hover:bg-primary/[0.02] transition-colors" data-testid="segment-bulk-b2b">
              <div>
                <ShoppingBag className="w-10 h-10 mb-8 text-primary/40" />
                <h3 className="text-2xl font-semibold mb-4 tracking-tight" data-testid="text-segment-bulk-title">
                  {language === 'uz' ? 'Ulgurji B2B' : 
                   language === 'ru' ? 'Оптовые B2B' : 
                   'Bulk B2B'}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  {language === 'uz' ? 'Katalog mahsulotlari bo\'yicha hajmga asoslangan buyurtmalar. Distributor va ulgurji xaridorlar uchun.' : 
                   language === 'ru' ? 'Объёмные заказы по каталогу. Для дистрибьюторов и оптовых покупателей.' : 
                   'Volume-based orders from catalog. For distributors and wholesale buyers.'}
                </p>
                <ul className="text-xs text-muted-foreground/80 space-y-1 mb-8">
                  <li>• {language === 'uz' ? 'Hajmga qarab narx' : language === 'ru' ? 'Цена от объёма' : 'Volume pricing'}</li>
                  <li>• {language === 'uz' ? 'Barqaror sifat' : language === 'ru' ? 'Стабильное качество' : 'Consistent quality'}</li>
                  <li>• {language === 'uz' ? 'Yetkazib berish: 4–6 hafta' : language === 'ru' ? 'Доставка: 4–6 недель' : 'Lead time: 4–6 weeks'}</li>
                </ul>
              </div>
              <Link href="/catalog">
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] font-bold" data-testid="button-view-catalog">
                  {language === 'uz' ? 'Katalogni Ko\'rish' : 
                   language === 'ru' ? 'Смотреть Каталог' : 
                   'View Catalog'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Elements: Client Partners */}
      <section className="py-24 bg-background border-b border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/40 font-semibold mb-12">
              {language === 'uz' ? 'Institutsional Hamkorlar' : 
               language === 'ru' ? 'Институциональные Партнёры' : 
               'Institutional Partners'}
            </span>
            <div className="w-full flex flex-wrap justify-center items-center gap-x-24 gap-y-12 opacity-20 grayscale">
              <div className="font-serif italic text-2xl tracking-tighter">Grand Hyatt</div>
              <div className="font-serif italic text-2xl tracking-tighter">Ritz-Carlton</div>
              <div className="font-serif italic text-2xl tracking-tighter">Four Seasons</div>
              <div className="font-serif italic text-2xl tracking-tighter">Mandarin Oriental</div>
              <div className="font-serif italic text-2xl tracking-tighter">St. Regis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-24 lg:py-32 bg-[#F9F7F5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary/60" />
                <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium">{t.home.trendingSubtitle}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-6" data-testid="text-trending-title">
                {t.home.trendingTitle}
              </h2>
              <div className="w-24 h-px bg-primary/20 mx-auto" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/product/${product.slug}`} data-testid={`link-trending-product-${product.id}`}>
                    <div className="group cursor-pointer" data-testid={`card-trending-product-${product.id}`}>
                      <div className="aspect-square overflow-hidden mb-4 bg-muted relative">
                        {product.images ? (
                          <img
                            src={typeof product.images === 'string' ? product.images : (product.images as string[])[0]}
                            alt={getLocalizedName(product)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 opacity-20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                      </div>
                      <h3 className="text-sm font-medium tracking-wide mb-1 group-hover:text-primary transition-colors">
                        {getLocalizedName(product)}
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.home.viewDetails}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/catalog">
                <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs" data-testid="button-view-all-trending">
                  {t.home.viewAllProducts}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Professional Use Cases - Segmented Trust */}
      <section className="py-24 lg:py-32 bg-background border-b border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
              {language === 'uz' ? 'To\'liq Tsikl Afzalligi' : 
               language === 'ru' ? 'Преимущество Полного Цикла' : 
               'Full-Cycle Advantage'}
            </span>
            <h2 className="text-4xl font-semibold mb-4">
              {language === 'uz' ? 'Nima Uchun To\'liq Tsikl Muhim' : 
               language === 'ru' ? 'Почему Полный Цикл Важен' : 
               'Why Full-Cycle Matters'}
            </h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              {language === 'uz' ? 'Ipdan tayyor mahsulotgacha bir fabrikada. Oraliq sotuvchilar yo\'q. Barqaror sifat. Aniq muddatlar.' : 
               language === 'ru' ? 'От пряжи до готового изделия на одной фабрике. Без посредников. Стабильное качество. Чёткие сроки.' : 
               'From yarn to finished product in one factory. No middlemen. Consistent quality. Predictable lead times.'}
            </p>
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
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">
                {language === 'uz' ? 'Global Logistika' : 
                 language === 'ru' ? 'Глобальная Логистика' : 
                 'Global Logistics'}
              </h4>
              <p className="text-xs text-muted-foreground font-light">
                {language === 'uz' ? 'Yevropa Ittifoqi, AQSh va MDH bozorlariga muammosiz eksport.' : 
                 language === 'ru' ? 'Бесперебойный экспорт на рынки ЕС, США и СНГ.' : 
                 'Seamless export to EU, USA, and CIS markets.'}
              </p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">
                {language === 'uz' ? 'Tasdiqlangan Sifat' : 
                 language === 'ru' ? 'Проверенное Качество' : 
                 'Verified Quality'}
              </h4>
              <p className="text-xs text-muted-foreground font-light">
                {language === 'uz' ? 'OEKO-TEX® sertifikatlangan sanoat standartlari.' : 
                 language === 'ru' ? 'Промышленные стандарты, сертифицированные OEKO-TEX®.' : 
                 'OEKO-TEX® certified industrial standards.'}
              </p>
            </div>
            <div className="text-center">
              <Factory className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">
                {language === 'uz' ? 'Asosiy Manba' : 
                 language === 'ru' ? 'Первоисточник' : 
                 'Primary Source'}
              </h4>
              <p className="text-xs text-muted-foreground font-light">
                {language === 'uz' ? 'Zavoddan to\'g\'ridan-to\'g\'ri shaffoflik va miqyos.' : 
                 language === 'ru' ? 'Прямая прозрачность и масштаб от производителя.' : 
                 'Factory-direct transparency and scale.'}
              </p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-6 text-primary/30" />
              <h4 className="text-sm uppercase tracking-widest font-semibold mb-2">
                {language === 'uz' ? 'Maxsus Dizayn' : 
                 language === 'ru' ? 'Индивидуальный Дизайн' : 
                 'Bespoke Design'}
              </h4>
              <p className="text-xs text-muted-foreground font-light">
                {language === 'uz' ? 'Maxsus kashtado\'zlik va xususiy brending.' : 
                 language === 'ru' ? 'Индивидуальная вышивка и создание собственных брендов.' : 
                 'Custom embroidery and private labeling.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section - Capabilities Focus */}
      <section className="py-24 lg:py-32 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
              {language === 'uz' ? 'Ishlab Chiqarish Imkoniyatlari' : 
               language === 'ru' ? 'Производственные Возможности' : 
               'Manufacturing Capabilities'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold uppercase tracking-widest" data-testid="text-whyus-title">
              {language === 'uz' ? 'To\'g\'ridan-to\'g\'ri Ta\'minot Infratuzilmasi' : 
               language === 'ru' ? 'Инфраструктура Прямых Поставок' : 
               'Direct Supply Infrastructure'}
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

      {/* Factory Credentials & Proof */}
      <section className="py-24 lg:py-32 bg-primary/[0.02] border-y border-primary/5" data-testid="section-factory-credentials">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-medium mb-6 block">
              {language === 'uz' ? 'Fabrika Hujjatlari' : language === 'ru' ? 'Документация Фабрики' : 'Factory Documentation'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold" data-testid="text-credentials-title">
              {language === 'uz' ? 'Tasdiqlangan Ishlab Chiqarish Imkoniyatlari' : 
               language === 'ru' ? 'Подтверждённые Производственные Возможности' : 
               'Verified Manufacturing Capabilities'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6" data-testid="credential-iso">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="font-semibold mb-2">ISO 9001:2015</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'uz' ? 'Sertifikatlangan sifat boshqaruvi' : 
                 language === 'ru' ? 'Сертифицированная система качества' : 
                 'Certified quality management'}
              </p>
            </div>
            <div className="text-center p-6" data-testid="credential-oeko">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="font-semibold mb-2">OEKO-TEX Standard 100</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'uz' ? 'Xavfsiz bo\'yoqlar va materiallar' : 
                 language === 'ru' ? 'Безопасные красители и материалы' : 
                 'Safe dyes and materials'}
              </p>
            </div>
            <div className="text-center p-6" data-testid="credential-capacity">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <Factory className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="font-semibold mb-2">50,000+ {language === 'uz' ? 'dona/oy' : language === 'ru' ? 'шт./мес.' : 'pcs/month'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'uz' ? 'Oylik ishlab chiqarish hajmi' : 
                 language === 'ru' ? 'Производственная мощность' : 
                 'Monthly production capacity'}
              </p>
            </div>
            <div className="text-center p-6" data-testid="credential-export">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="font-semibold mb-2">15+ {language === 'uz' ? 'davlat' : language === 'ru' ? 'стран' : 'countries'}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'uz' ? 'Eksport geografiyasi' : 
                 language === 'ru' ? 'География экспорта' : 
                 'Export geography'}
              </p>
            </div>
          </div>

          {/* International Trust Signals */}
          <div className="bg-card/50 border border-primary/5 p-8 rounded-lg" data-testid="trust-international">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div data-testid="trust-incoterms">
                <p className="text-2xl font-semibold text-primary mb-2">EXW / FOB / CIF</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' ? 'Incoterms shartlari' : language === 'ru' ? 'Условия Incoterms' : 'Incoterms available'}
                </p>
              </div>
              <div data-testid="trust-payment">
                <p className="text-2xl font-semibold text-primary mb-2">T/T, L/C</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' ? 'To\'lov shartlari' : language === 'ru' ? 'Условия оплаты' : 'Payment terms'}
                </p>
              </div>
              <div data-testid="trust-inspection">
                <p className="text-2xl font-semibold text-primary mb-2">SGS, Bureau Veritas</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' ? 'Uchinchi tomon tekshiruvi' : language === 'ru' ? 'Сторонняя инспекция' : 'Third-party inspection'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Voice */}
      <section className="py-24 lg:py-32 bg-background" data-testid="section-founder">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-medium mb-6 block">
                {language === 'uz' ? 'Asoschidan' : language === 'ru' ? 'От Основателя' : 'From the Founder'}
              </span>
              <blockquote className="text-xl sm:text-2xl font-light leading-relaxed text-muted-foreground mb-8 italic" data-testid="text-founder-quote">
                {language === 'uz' ? '"Biz 2015-yildan beri to\'liq tsikl tekstil ishlab chiqarish bilan shug\'ullanmoqdamiz. Har bir buyurtma shaxsan men yoki texnik jamoam tomonidan nazorat qilinadi. Sizning loyihangiz bizning obro\'imizdir."' : 
                 language === 'ru' ? '"Мы занимаемся текстильным производством полного цикла с 2015 года. Каждый заказ контролируется лично мной или технической командой. Ваш проект — это наша репутация."' : 
                 '"We have been operating full-cycle textile manufacturing since 2015. Every order is personally supervised by me or my technical team. Your project is our reputation."'}
              </blockquote>
              <div className="flex flex-col items-center">
                <p className="font-semibold" data-testid="text-founder-name">
                  {language === 'uz' ? 'Mary Collection Jamoasi' : 
                   language === 'ru' ? 'Команда Mary Collection' : 
                   'Mary Collection Team'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Namangan, {language === 'uz' ? 'O\'zbekiston' : language === 'ru' ? 'Узбекистан' : 'Uzbekistan'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* B2B FAQ */}
      <section className="py-24 lg:py-32 bg-primary/[0.02]" data-testid="section-faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-medium mb-6 block">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold" data-testid="text-faq-title">
              {language === 'uz' ? 'B2B Buyurtmalar Bo\'yicha Savollar' : 
               language === 'ru' ? 'Вопросы по B2B Заказам' : 
               'B2B Order Questions'}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 bg-card border border-primary/5 rounded-lg" data-testid="faq-moq">
              <h3 className="font-semibold mb-2">
                {language === 'uz' ? 'Minimal buyurtma hajmi qancha?' : 
                 language === 'ru' ? 'Каков минимальный объём заказа?' : 
                 'What is the minimum order quantity?'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'uz' ? 'Standart mahsulotlar uchun 500 dona. Maxsus ranglar yoki dizaynlar uchun 1,000+ dona.' : 
                 language === 'ru' ? '500 единиц для стандартных товаров. 1,000+ единиц для кастомных цветов или дизайнов.' : 
                 '500 units for standard products. 1,000+ units for custom colors or designs.'}
              </p>
            </div>
            <div className="p-6 bg-card border border-primary/5 rounded-lg" data-testid="faq-samples">
              <h3 className="font-semibold mb-2">
                {language === 'uz' ? 'Namunalarni qanday olsam bo\'ladi?' : 
                 language === 'ru' ? 'Как получить образцы?' : 
                 'How can I get samples?'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'uz' ? 'Katalog namunalari 5-7 ish kunida yuboriladi. Maxsus namunalar 2-3 haftada tayyorlanadi. Kuryer harajatlari xaridor tomonidan to\'lanadi.' : 
                 language === 'ru' ? 'Каталожные образцы отправляются за 5-7 рабочих дней. Кастомные образцы — 2-3 недели. Курьерские расходы оплачивает покупатель.' : 
                 'Catalog samples ship within 5-7 business days. Custom samples require 2-3 weeks. Courier costs are paid by buyer.'}
              </p>
            </div>
            <div className="p-6 bg-card border border-primary/5 rounded-lg" data-testid="faq-leadtime">
              <h3 className="font-semibold mb-2">
                {language === 'uz' ? 'Ishlab chiqarish muddati qancha?' : 
                 language === 'ru' ? 'Каковы сроки производства?' : 
                 'What is the production lead time?'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'uz' ? 'Standart buyurtmalar: 4-6 hafta. Katta hajmli yoki maxsus buyurtmalar: 6-8 hafta. Namuna tasdiqlashdan keyin hisoblash boshlanadi.' : 
                 language === 'ru' ? 'Стандартные заказы: 4-6 недель. Крупные или кастомные заказы: 6-8 недель. Отсчёт начинается после утверждения образца.' : 
                 'Standard orders: 4-6 weeks. Large or custom orders: 6-8 weeks. Counting starts after sample approval.'}
              </p>
            </div>
            <div className="p-6 bg-card border border-primary/5 rounded-lg" data-testid="faq-payment">
              <h3 className="font-semibold mb-2">
                {language === 'uz' ? 'Qanday to\'lov usullari mavjud?' : 
                 language === 'ru' ? 'Какие способы оплаты доступны?' : 
                 'What payment methods are available?'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'uz' ? 'T/T (bank o\'tkazmasi): 30% oldindan, 70% jo\'natishdan oldin. L/C (akkreditiv): katta hajmli buyurtmalar uchun.' : 
                 language === 'ru' ? 'T/T (банковский перевод): 30% предоплата, 70% перед отгрузкой. L/C (аккредитив): для крупных заказов.' : 
                 'T/T (wire transfer): 30% deposit, 70% before shipment. L/C (letter of credit): available for large orders.'}
              </p>
            </div>
            <div className="p-6 bg-card border border-primary/5 rounded-lg" data-testid="faq-private-label">
              <h3 className="font-semibold mb-2">
                {language === 'uz' ? 'Xususiy brend / OEM qilasizlarmi?' : 
                 language === 'ru' ? 'Делаете ли вы частную марку / OEM?' : 
                 'Do you do private label / OEM?'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'uz' ? 'Ha. Sizning brendingiz ostida to\'liq tsikl ishlab chiqarish: ipdan tayyor mahsulotgacha. Yorliq, qadoqlash, maxsus dizayn.' : 
                 language === 'ru' ? 'Да. Полный цикл производства под вашим брендом: от пряжи до готового изделия. Этикетки, упаковка, кастомный дизайн.' : 
                 'Yes. Full-cycle manufacturing under your brand: from yarn to finished product. Labels, packaging, custom design.'}
              </p>
            </div>
          </div>
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
              {language === 'uz' ? 'Ulgurji so\'rovlar va maxsus buyurtmalar uchun xalqaro eksport bo\'limimiz bilan bog\'laning.' : 
               language === 'ru' ? 'Свяжитесь с нашим отделом международного экспорта для оптовых запросов и индивидуальных заказов.' : 
               'Connect with our international export department for wholesale inquiries and custom orders.'}
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
                  href="mailto:mariamhome.uz@gmail.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block break-all font-light"
                  data-testid="link-home-email"
                >
                  mariamhome.uz@gmail.com
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
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Istiqbol+MFY+Turakurgan+1A+Namangan+Uzbekistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block leading-relaxed font-light"
                  data-testid="link-home-address"
                >
                  {t.home.address}
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20 text-center">
            <Link href="/contact">
              <Button size="lg" className="rounded-none px-16 h-14 uppercase tracking-[0.3em] text-[10px] font-bold">
                Begin a Partnership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
