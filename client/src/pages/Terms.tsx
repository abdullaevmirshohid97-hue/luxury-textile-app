import { useTranslations, useLanguageStore } from "@/lib/i18n";

export default function Terms() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const content = {
    en: {
      title: "Terms of Use",
      lastUpdated: "Last updated: January 2026",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing and using the Mary Collection website, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.`
        },
        {
          title: "2. Use of Website",
          content: `You agree to use this website only for lawful purposes and in a manner that does not infringe upon the rights of others. You may not:
• Use the website for any fraudulent or unlawful purpose
• Attempt to gain unauthorized access to our systems
• Interfere with the proper functioning of the website
• Transmit any harmful code or malware
• Use automated systems to access the website without permission`
        },
        {
          title: "3. Intellectual Property",
          content: `All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Mary Collection or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.`
        },
        {
          title: "4. Product Information",
          content: `We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content is accurate, complete, or error-free. Products are subject to availability and we reserve the right to discontinue any product at any time.`
        },
        {
          title: "5. B2B Orders and Pricing",
          content: `• All B2B pricing is provided upon request and is subject to negotiation
• Minimum order quantities may apply for bulk orders
• Prices are subject to change without notice
• Payment terms are established per individual agreement
• Custom orders may have specific terms and conditions`
        },
        {
          title: "6. Limitation of Liability",
          content: `Mary Collection shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or products. Our total liability shall not exceed the amount paid for the products in question.`
        },
        {
          title: "7. Indemnification",
          content: `You agree to indemnify and hold Mary Collection harmless from any claims, losses, or damages arising from your violation of these terms or your use of the website.`
        },
        {
          title: "8. Governing Law",
          content: `These terms shall be governed by and construed in accordance with the laws of the Republic of Uzbekistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Uzbekistan.`
        },
        {
          title: "9. Changes to Terms",
          content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.`
        },
        {
          title: "10. Contact Information",
          content: `For questions about these Terms of Use, please contact us at:
Email: mariamhome.uz@gmail.com
Phone: +998 88 259 94 44
Address: Istiqbol MFY, Turakurgan street, Namangan city, Uzbekistan`
        }
      ]
    },
    ru: {
      title: "Условия использования",
      lastUpdated: "Последнее обновление: январь 2026",
      sections: [
        {
          title: "1. Принятие условий",
          content: `Получая доступ к сайту Mary Collection и используя его, вы принимаете и соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сайт.`
        },
        {
          title: "2. Использование сайта",
          content: `Вы соглашаетесь использовать этот сайт только в законных целях и таким образом, который не нарушает права других лиц. Вы не имеете права:
• Использовать сайт в мошеннических или незаконных целях
• Пытаться получить несанкционированный доступ к нашим системам
• Вмешиваться в нормальное функционирование сайта
• Передавать вредоносный код или вредоносное ПО
• Использовать автоматизированные системы для доступа к сайту без разрешения`
        },
        {
          title: "3. Интеллектуальная собственность",
          content: `Весь контент на этом сайте, включая тексты, графику, логотипы, изображения и программное обеспечение, является собственностью Mary Collection или поставщиков контента и защищен международными законами об авторском праве. Вы не можете воспроизводить, распространять или создавать производные работы без нашего письменного разрешения.`
        },
        {
          title: "4. Информация о продукции",
          content: `Мы стремимся предоставлять точные описания и изображения продукции. Однако мы не гарантируем, что описания продуктов, цвета или другой контент являются точными, полными или безошибочными. Продукция предоставляется при наличии, и мы оставляем за собой право прекратить выпуск любого продукта в любое время.`
        },
        {
          title: "5. B2B заказы и ценообразование",
          content: `• Все B2B цены предоставляются по запросу и подлежат обсуждению
• Для оптовых заказов могут применяться минимальные объемы заказа
• Цены могут быть изменены без предварительного уведомления
• Условия оплаты устанавливаются индивидуально
• Индивидуальные заказы могут иметь особые условия`
        },
        {
          title: "6. Ограничение ответственности",
          content: `Mary Collection не несет ответственности за любые косвенные, случайные, особые или последующие убытки, возникшие в результате использования вами сайта или продукции. Наша общая ответственность не превышает сумму, уплаченную за соответствующую продукцию.`
        },
        {
          title: "7. Возмещение ущерба",
          content: `Вы соглашаетесь возместить убытки и оградить Mary Collection от любых претензий, потерь или ущерба, возникших в результате нарушения вами этих условий или использования сайта.`
        },
        {
          title: "8. Применимое право",
          content: `Настоящие условия регулируются и толкуются в соответствии с законодательством Республики Узбекистан. Любые споры, возникающие из этих условий, подлежат исключительной юрисдикции судов Узбекистана.`
        },
        {
          title: "9. Изменения условий",
          content: `Мы оставляем за собой право изменять эти условия в любое время. Изменения вступают в силу сразу после публикации на сайте. Продолжение использования сайта означает принятие измененных условий.`
        },
        {
          title: "10. Контактная информация",
          content: `По вопросам об Условиях использования свяжитесь с нами:
Email: mariamhome.uz@gmail.com
Телефон: +998 88 259 94 44
Адрес: Истикбол МФЙ, улица Туракурган, город Наманган, Узбекистан`
        }
      ]
    },
    uz: {
      title: "Foydalanish shartlari",
      lastUpdated: "Oxirgi yangilanish: 2026 yil yanvar",
      sections: [
        {
          title: "1. Shartlarni qabul qilish",
          content: `Mary Collection veb-saytiga kirish va undan foydalanish orqali siz ushbu Foydalanish shartlarini qabul qilasiz va ularga rioya qilishga rozilik bildirasiz. Agar siz ushbu shartlarga rozi bo'lmasangiz, veb-saytimizdan foydalanmang.`
        },
        {
          title: "2. Veb-saytdan foydalanish",
          content: `Siz ushbu veb-saytdan faqat qonuniy maqsadlarda va boshqalarning huquqlarini buzmaydigan tarzda foydalanishga rozilik bildirasiz. Siz quyidagilarni qila olmaysiz:
• Veb-saytdan firibgarlik yoki noqonuniy maqsadlarda foydalanish
• Tizimlarimizga ruxsatsiz kirish urinishlari
• Veb-saytning normal ishlashiga aralashish
• Zararli kod yoki zararli dasturlarni uzatish
• Ruxsatsiz avtomatlashtirilgan tizimlardan foydalanish`
        },
        {
          title: "3. Intellektual mulk",
          content: `Ushbu veb-saytdagi barcha kontent, shu jumladan matnlar, grafikalar, logotiplar, rasmlar va dasturiy ta'minot Mary Collection yoki kontent yetkazib beruvchilarning mulki hisoblanadi va xalqaro mualliflik huquqi qonunlari bilan himoyalangan. Siz bizning yozma ruxsatimizdan boshqa ko'paytira, tarqata yoki hosila ishlarni yaratolmaysiz.`
        },
        {
          title: "4. Mahsulot ma'lumotlari",
          content: `Biz aniq mahsulot tavsiflarini va rasmlarini taqdim etishga harakat qilamiz. Biroq, mahsulot tavsiflari, ranglar yoki boshqa kontent to'g'ri, to'liq yoki xatosiz ekanligiga kafolat bermaymiz. Mahsulotlar mavjudligiga qarab taqdim etiladi va biz istalgan vaqtda istalgan mahsulotni to'xtatish huquqini saqlab qolamiz.`
        },
        {
          title: "5. B2B buyurtmalar va narxlash",
          content: `• Barcha B2B narxlar so'rov bo'yicha taqdim etiladi va muzokaraga bog'liq
• Ulgurji buyurtmalar uchun minimal buyurtma miqdorlari qo'llanilishi mumkin
• Narxlar oldindan xabardor qilmasdan o'zgartirilishi mumkin
• To'lov shartlari individual kelishuvga muvofiq belgilanadi
• Maxsus buyurtmalar alohida shartlarga ega bo'lishi mumkin`
        },
        {
          title: "6. Javobgarlikning cheklanishi",
          content: `Mary Collection veb-sayt yoki mahsulotlardan foydalanishingiz natijasida yuzaga kelgan har qanday bilvosita, tasodifiy, maxsus yoki oqibatdagi zararlar uchun javobgar emas. Bizning umumiy javobgarligimiz tegishli mahsulotlar uchun to'langan summadan oshmaydi.`
        },
        {
          title: "7. Zararni qoplash",
          content: `Siz ushbu shartlarni buzganingiz yoki veb-saytdan foydalanganingiz natijasida yuzaga kelgan har qanday da'volar, yo'qotishlar yoki zararlardan Mary Collectionni himoya qilish va zarar yetkazmaslikka rozilik bildirasiz.`
        },
        {
          title: "8. Qo'llaniladigan qonun",
          content: `Ushbu shartlar O'zbekiston Respublikasi qonunchiligiga muvofiq boshqariladi va talqin qilinadi. Ushbu shartlardan kelib chiqadigan har qanday nizolar O'zbekiston sudlarining mutlaq yurisdiksiyasiga tegishli.`
        },
        {
          title: "9. Shartlarga o'zgartirishlar",
          content: `Biz istalgan vaqtda ushbu shartlarni o'zgartirish huquqini saqlab qolamiz. O'zgarishlar veb-saytda e'lon qilingan zahoti kuchga kiradi. Veb-saytdan davom etgan foydalanish o'zgartirilgan shartlarni qabul qilishni bildiradi.`
        },
        {
          title: "10. Aloqa ma'lumotlari",
          content: `Foydalanish shartlari haqida savollar uchun biz bilan bog'laning:
Email: mariamhome.uz@gmail.com
Telefon: +998 88 259 94 44
Manzil: Istiqbol MFY, Turakurgan ko'chasi, Namangan shahri, O'zbekiston`
        }
      ]
    }
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-2" data-testid="text-terms-title">
          {currentContent.title}
        </h1>
        <p className="text-muted-foreground mb-8">{currentContent.lastUpdated}</p>

        <div className="space-y-8">
          {currentContent.sections.map((section, index) => (
            <section key={index} className="space-y-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="text-body text-muted-foreground whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
