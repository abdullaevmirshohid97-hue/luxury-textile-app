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
      title: language === 'uz' ? "Mehmonxonalar" : 
             language === 'ru' ? "Отели" : 
             "Hotels",
      description: language === 'uz' ? "Brendlangan choyshablar, xalatlar, sochiqlar. Sanoat yuvish sinovidan o'tgan." : 
                   language === 'ru' ? "Брендированное бельё, халаты, полотенца. Промышленная стирка." : 
                   "Branded linens, bathrobes, towels. Industrial wash tested.",
    },
    {
      icon: Waves,
      title: language === 'uz' ? "Spa va Wellness" : 
             language === 'ru' ? "Спа и Велнес" : 
             "Spa & Wellness",
      description: language === 'uz' ? "Professional tekstil. Namlik yutish va chidamlilik sinovidan o'tgan." : 
                   language === 'ru' ? "Профессиональный текстиль. Тестирование на впитываемость и износостойкость." : 
                   "Professional textiles. Absorbency and durability tested.",
    },
    {
      icon: ShoppingBag,
      title: language === 'uz' ? "Chakana Brendlar" : 
             language === 'ru' ? "Розничные Бренды" : 
             "Retail Brands",
      description: language === 'uz' ? "OEM/ODM ishlab chiqarish. Sizning spetsifikatsiyalaringiz, nazorat ostida ishlab chiqarish." : 
                   language === 'ru' ? "OEM/ODM производство. Ваши спецификации, контролируемое производство." : 
                   "OEM/ODM manufacturing. Your specifications, controlled production.",
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
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/70">
                {language === 'uz' ? 'Vertikal Ishlab Chiqaruvchi' : 
                 language === 'ru' ? 'Вертикальный Производитель' : 
                 'Vertical Manufacturer'}
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-8"
              data-testid="text-hero-title"
            >
              {language === 'uz' ? <>Nazorat Ostida <br /> <span className="text-white/80">Ishlab Chiqarish</span></> : 
               language === 'ru' ? <>Контролируемое <br /> <span className="text-white/80">Производство</span></> : 
               <>Controlled <br /> <span className="text-white/80">Production</span></>}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-white/80 mb-8 max-w-xl font-light leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              {language === 'uz' ? 'Mehmonxonalar va brendlar uchun tekstil ishlab chiqarish. Xom paxtadan tayyor mahsulotgacha nazorat.' : 
               language === 'ru' ? 'Текстильное производство для отелей и брендов. Контроль от сырого хлопка до готовой продукции.' : 
               'Textile manufacturing for hotels and brands. Control from raw cotton to finished product.'}
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-sm text-white/60 mb-8"
            >
              {language === 'uz' ? 'Namunalar majburiyatdan oldin mavjud.' : 
               language === 'ru' ? 'Образцы до начала заказа.' : 
               'Sampling available before commitment.'}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
              <Link href="/business">
                <Button size="lg" className="min-w-[200px] rounded-none uppercase tracking-widest text-xs font-semibold bg-white text-black hover:bg-white/90 shadow-lg" data-testid="button-shop-collection">
                  {language === 'uz' ? 'B2B Spetsifikatsiyalar' : 
                   language === 'ru' ? 'B2B Спецификации' : 
                   'B2B Specifications'}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] rounded-none uppercase tracking-widest text-xs font-semibold bg-white/5 border-white/40 text-white backdrop-blur-md hover:bg-white/10"
                  data-testid="button-wholesale-offer"
                >
                  {language === 'uz' ? 'So\'rov Yuborish' : 
                   language === 'ru' ? 'Отправить Запрос' : 
                   'Submit Inquiry'}
                </Button>
              </Link>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-xs text-white/50 mt-6"
            >
              {language === 'uz' ? 'Biz odatda 24–48 soat ichida javob beramiz.' : 
               language === 'ru' ? 'Мы обычно отвечаем в течение 24–48 часов.' : 
               'We typically respond within 24–48 hours.'}
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
                {language === 'uz' ? 'Ishlab Chiqarish' : 
                 language === 'ru' ? 'Производство' : 
                 'Production'}
              </span>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-8 leading-tight" data-testid="text-philosophy-title">
                {language === 'uz' ? 'Vertikal Integratsiya' : 
                 language === 'ru' ? 'Вертикальная Интеграция' : 
                 'Vertical Integration'}
              </h2>
              <div className="space-y-6 text-body text-muted-foreground text-lg leading-relaxed font-light">
                <p>
                  {language === 'uz' ? "O'zbekiston uzun shtapelli paxtasidan tayyor mahsulotgacha — har bir bosqich nazorat ostida." : 
                   language === 'ru' ? 'От узбекского длинноволокнистого хлопка до готовой продукции — каждый этап под контролем.' : 
                   'From Uzbek long-staple cotton to finished product—every stage controlled.'}
                </p>
                <p>
                  {language === 'uz' ? "200+ sanoat yuvish davrida sinovdan o'tgan. OEKO-TEX va ISO 9001 sertifikatlangan." : 
                   language === 'ru' ? 'Тестирование 200+ промышленных стирок. Сертификация OEKO-TEX и ISO 9001.' : 
                   'Tested through 200+ industrial wash cycles. OEKO-TEX and ISO 9001 certified.'}
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
            {/* Hospitality Path */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between hover:bg-primary/[0.02] transition-colors">
              <div>
                <Building2 className="w-10 h-10 mb-8 text-primary/40" />
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">
                  {language === 'uz' ? 'Mehmonxonalar' : 
                   language === 'ru' ? 'Отели' : 
                   'Hospitality'}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-8">
                  {language === 'uz' ? 'Sanoat yuvishga chidamli tekstil. Brendlangan choyshablar, xalatlar, sochiqlar.' : 
                   language === 'ru' ? 'Текстиль для промышленной стирки. Брендированное бельё, халаты, полотенца.' : 
                   'Industrial wash durable textiles. Branded linens, bathrobes, towels.'}
                </p>
              </div>
              <Link href="/contact?segment=hospitality">
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] font-bold">
                  {language === 'uz' ? 'So\'rov' : 
                   language === 'ru' ? 'Запрос' : 
                   'Inquire'}
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground/60 mt-3 text-center">
                {language === 'uz' ? '24–48 soat ichida javob' : 
                 language === 'ru' ? 'Ответ в течение 24–48 ч.' : 
                 'Response within 24–48 hrs'}
              </p>
            </div>

            {/* Retail Path */}
            <div className="p-12 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-between hover:bg-primary/[0.02] transition-colors">
              <div>
                <Factory className="w-10 h-10 mb-8 text-primary/40" />
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">
                  {language === 'uz' ? 'OEM/ODM' : 
                   language === 'ru' ? 'OEM/ODM' : 
                   'OEM/ODM'}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-8">
                  {language === 'uz' ? 'Chakana brendlar uchun shartnomaviy ishlab chiqarish. Sizning spetsifikatsiyalaringiz.' : 
                   language === 'ru' ? 'Контрактное производство для розничных брендов. Ваши спецификации.' : 
                   'Contract manufacturing for retail brands. Your specifications.'}
                </p>
              </div>
              <Link href="/contact?segment=retail">
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] font-bold">
                  {language === 'uz' ? 'So\'rov' : 
                   language === 'ru' ? 'Запрос' : 
                   'Inquire'}
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground/60 mt-3 text-center">
                {language === 'uz' ? '24–48 soat ichida javob' : 
                 language === 'ru' ? 'Ответ в течение 24–48 ч.' : 
                 'Response within 24–48 hrs'}
              </p>
            </div>

            {/* Catalog Path */}
            <div className="p-12 flex flex-col justify-between hover:bg-primary/[0.02] transition-colors">
              <div>
                <ShoppingBag className="w-10 h-10 mb-8 text-primary/40" />
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">
                  {language === 'uz' ? 'Katalog' : 
                   language === 'ru' ? 'Каталог' : 
                   'Catalog'}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-8">
                  {language === 'uz' ? 'Mahsulot turlarini ko\'rish. Spetsifikatsiyalar va hajm variantlari.' : 
                   language === 'ru' ? 'Просмотр ассортимента продукции. Спецификации и варианты объёмов.' : 
                   'Browse product range. Specifications and volume options.'}
                </p>
              </div>
              <Link href="/catalog">
                <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] font-bold">
                  {language === 'uz' ? 'Katalog' : 
                   language === 'ru' ? 'Каталог' : 
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
              {language === 'uz' ? 'Global Miqyos' : 
               language === 'ru' ? 'Глобальный Масштаб' : 
               'Global Scale'}
            </span>
            <h2 className="text-4xl font-semibold mb-4">
              {language === 'uz' ? 'Sanoat Tasdig\'i' : 
               language === 'ru' ? 'Промышленная Верификация' : 
               'Industrial Verification'}
            </h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
              {language === 'uz' ? 'Dunyodagi eng talabchan mehmondo\'stlik va chakana brendlar uchun barqaror sifatni ta\'minlovchi vertikal integratsiya.' : 
               language === 'ru' ? 'Вертикальная интеграция, обеспечивающая стабильное качество для самых требовательных мировых брендов гостеприимства и розничной торговли.' : 
               'Vertical integration ensuring consistent quality for the world\'s most demanding hospitality and retail brands.'}
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
                Begin a Partnership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
