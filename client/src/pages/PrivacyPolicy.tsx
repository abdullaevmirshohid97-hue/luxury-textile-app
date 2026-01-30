import { useTranslations, useLanguageStore } from "@/lib/i18n";

export default function PrivacyPolicy() {
  const t = useTranslations();
  const { language } = useLanguageStore();

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 2026",
      sections: [
        {
          title: "1. Information We Collect",
          content: `We collect information you provide directly to us, including:
• Contact information (name, email, phone number)
• Business information (company name, business type)
• Inquiry details (product interests, order quantities)
• Communication preferences

We automatically collect certain information when you visit our website:
• IP address (hashed for privacy)
• Browser type and version
• Pages visited and time spent
• Device information`
        },
        {
          title: "2. How We Use Your Information",
          content: `We use the information we collect to:
• Respond to your inquiries and provide customer support
• Process and fulfill your orders
• Send you marketing communications (with your consent)
• Improve our website and services
• Analyze website usage and trends
• Comply with legal obligations`
        },
        {
          title: "3. Information Sharing",
          content: `We do not sell your personal information. We may share your information with:
• Service providers who assist in our operations
• Business partners for order fulfillment
• Legal authorities when required by law
• Affiliated companies for business purposes`
        },
        {
          title: "4. Data Security",
          content: `We implement appropriate technical and organizational measures to protect your personal information, including:
• Encrypted data transmission (HTTPS/TLS)
• Secure server infrastructure
• Regular security assessments
• Limited access to personal data`
        },
        {
          title: "5. Your Rights",
          content: `You have the right to:
• Access your personal information
• Correct inaccurate data
• Request deletion of your data
• Opt-out of marketing communications
• Lodge a complaint with a supervisory authority`
        },
        {
          title: "6. Cookies",
          content: `We use essential cookies to ensure basic website functionality. We do not use tracking cookies for advertising purposes. You can control cookie settings in your browser.`
        },
        {
          title: "7. Contact Us",
          content: `For privacy-related inquiries, please contact us at:
Email: info@marycollection.com
Phone: +998 88 259 94 44
Address: Istiqbol MFY, Turakurgan street, Namangan city, Uzbekistan`
        }
      ]
    },
    ru: {
      title: "Политика конфиденциальности",
      lastUpdated: "Последнее обновление: январь 2026",
      sections: [
        {
          title: "1. Собираемая информация",
          content: `Мы собираем информацию, которую вы предоставляете напрямую:
• Контактная информация (имя, email, телефон)
• Информация о бизнесе (название компании, тип деятельности)
• Детали запроса (интересующие продукты, объемы заказа)
• Предпочтения по коммуникации

Автоматически собираемая информация при посещении сайта:
• IP-адрес (хешированный для конфиденциальности)
• Тип и версия браузера
• Посещенные страницы и время пребывания
• Информация об устройстве`
        },
        {
          title: "2. Использование информации",
          content: `Мы используем собранную информацию для:
• Ответа на ваши запросы и поддержки клиентов
• Обработки и выполнения заказов
• Отправки маркетинговых сообщений (с вашего согласия)
• Улучшения нашего сайта и услуг
• Анализа использования сайта
• Соблюдения правовых обязательств`
        },
        {
          title: "3. Передача информации",
          content: `Мы не продаем вашу личную информацию. Мы можем передавать информацию:
• Поставщикам услуг, помогающим в нашей деятельности
• Бизнес-партнерам для выполнения заказов
• Правоохранительным органам по требованию закона
• Аффилированным компаниям в деловых целях`
        },
        {
          title: "4. Безопасность данных",
          content: `Мы применяем соответствующие технические и организационные меры защиты:
• Шифрование передачи данных (HTTPS/TLS)
• Безопасная серверная инфраструктура
• Регулярные оценки безопасности
• Ограниченный доступ к персональным данным`
        },
        {
          title: "5. Ваши права",
          content: `Вы имеете право:
• Получить доступ к своей личной информации
• Исправить неточные данные
• Запросить удаление ваших данных
• Отказаться от маркетинговых рассылок
• Подать жалобу в надзорный орган`
        },
        {
          title: "6. Файлы cookie",
          content: `Мы используем необходимые cookies для обеспечения базовой функциональности сайта. Мы не используем отслеживающие cookies для рекламы. Вы можете управлять настройками cookies в браузере.`
        },
        {
          title: "7. Связаться с нами",
          content: `По вопросам конфиденциальности свяжитесь с нами:
Email: info@marycollection.com
Телефон: +998 88 259 94 44
Адрес: Истикбол МФЙ, улица Туракурган, город Наманган, Узбекистан`
        }
      ]
    },
    uz: {
      title: "Maxfiylik siyosati",
      lastUpdated: "Oxirgi yangilanish: 2026 yil yanvar",
      sections: [
        {
          title: "1. Yig'iladigan ma'lumotlar",
          content: `Biz siz to'g'ridan-to'g'ri taqdim etgan ma'lumotlarni yig'amiz:
• Aloqa ma'lumotlari (ism, email, telefon raqami)
• Biznes ma'lumotlari (kompaniya nomi, faoliyat turi)
• So'rov tafsilotlari (qiziqish bildirgan mahsulotlar, buyurtma miqdori)
• Aloqa afzalliklari

Saytga tashrif buyurganingizda avtomatik ravishda yig'iladigan ma'lumotlar:
• IP-manzil (maxfiylik uchun xeshlanadi)
• Brauzer turi va versiyasi
• Tashrif buyurilgan sahifalar va vaqt
• Qurilma ma'lumotlari`
        },
        {
          title: "2. Ma'lumotlardan foydalanish",
          content: `Yig'ilgan ma'lumotlarni quyidagi maqsadlarda ishlatamiz:
• So'rovlaringizga javob berish va mijozlarni qo'llab-quvvatlash
• Buyurtmalarni qayta ishlash va bajarish
• Marketing xabarlarini yuborish (sizning roziligingiz bilan)
• Sayt va xizmatlarimizni yaxshilash
• Saytdan foydalanishni tahlil qilish
• Qonuniy majburiyatlarni bajarish`
        },
        {
          title: "3. Ma'lumotlarni almashish",
          content: `Biz shaxsiy ma'lumotlaringizni sotmaymiz. Ma'lumotlarni quyidagilar bilan ulashishimiz mumkin:
• Faoliyatimizga yordam beradigan xizmat ko'rsatuvchilar
• Buyurtmalarni bajarish uchun biznes hamkorlar
• Qonun talab qilganda huquqni muhofaza qilish organlari
• Biznes maqsadlari uchun bog'liq kompaniyalar`
        },
        {
          title: "4. Ma'lumotlar xavfsizligi",
          content: `Shaxsiy ma'lumotlaringizni himoya qilish uchun tegishli texnik va tashkiliy choralarni qo'llaymiz:
• Ma'lumotlarni shifrlangan uzatish (HTTPS/TLS)
• Xavfsiz server infratuzilmasi
• Muntazam xavfsizlik baholashlari
• Shaxsiy ma'lumotlarga cheklangan kirish`
        },
        {
          title: "5. Sizning huquqlaringiz",
          content: `Sizda quyidagi huquqlar mavjud:
• Shaxsiy ma'lumotlaringizga kirish
• Noto'g'ri ma'lumotlarni tuzatish
• Ma'lumotlaringizni o'chirishni so'rash
• Marketing xabarlaridan voz kechish
• Nazorat organiga shikoyat bildirish`
        },
        {
          title: "6. Cookie fayllari",
          content: `Biz saytning asosiy funksionalligini ta'minlash uchun zarur cookie fayllaridan foydalanamiz. Reklama uchun kuzatuv cookie fayllaridan foydalanmaymiz. Cookie sozlamalarini brauzeringizda boshqarishingiz mumkin.`
        },
        {
          title: "7. Biz bilan bog'laning",
          content: `Maxfiylik bilan bog'liq so'rovlar uchun biz bilan bog'laning:
Email: info@marycollection.com
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
        <h1 className="text-3xl md:text-4xl font-serif mb-2" data-testid="text-privacy-title">
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
