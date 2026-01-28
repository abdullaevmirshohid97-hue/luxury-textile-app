import { create } from "zustand";

export type Language = "uz" | "ru" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (typeof window !== "undefined" && (localStorage.getItem("mary-lang") as Language)) || "en",
  setLanguage: (lang: Language) => {
    localStorage.setItem("mary-lang", lang);
    set({ language: lang });
  },
}));

export const translations = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      catalog: "Katalog",
      contact: "Aloqa",
      bathrobes: "Xalatlar",
      towels: "Sochiqlar",
    },
    home: {
      heroTitle: "Uyingiz uchun hashamatli to'qimachilik",
      heroSubtitle: "Yumshoq pastellar va yuqori sifatli paxta bilan yaratilgan nozik xalatlar va sochiqlar",
      shopCollection: "Kolleksiyani ko'rish",
      contactUs: "Biz bilan bog'laning",
      philosophy: "Bizning falsafamiz",
      philosophyText: "Mary Collection yumshoq hashamat va benuqson hunarmandchilikka sodiq. Har bir mahsulot yuqori sifatli paxtadan tayyorlanib, uyingizga qulaylik va nafislik olib keladi.",
      featuredCollections: "Tanlangan kolleksiyalar",
      bathrobesCollection: "Xalatlar kolleksiyasi",
      bathrobesDesc: "Yumshoq pastel ranglarida hashamatli paxta xalatlar",
      towelsCollection: "Sochiqlar kolleksiyasi",
      towelsDesc: "Hashamatli hammomingiz uchun nozik sochiqlar",
      whyUs: "Nima uchun Mary Collection?",
      premiumCotton: "Premium paxta",
      premiumCottonDesc: "Faqat eng yuqori sifatli paxtadan foydalaniladi",
      pastelElegance: "Pastel nafosat",
      pastelEleganceDesc: "Yumshoq, chiroyli ranglar har qanday interyer uchun",
      exportQuality: "Eksport sifati",
      exportQualityDesc: "Xalqaro standartlarga javob beradigan mahsulotlar",
      craftmanship: "Hunarmandchilik",
      craftmanshipDesc: "Har bir tikuv bilan e'tibor va g'amxo'rlik",
    },
    catalog: {
      title: "Bizning kolleksiya",
      subtitle: "Uyingiz uchun hashamatli to'qimachilik mahsulotlari",
      filters: "Filtrlar",
      category: "Kategoriya",
      all: "Hammasi",
      color: "Rang",
      size: "O'lcham",
      requestInfo: "Ma'lumot so'rash",
    },
    product: {
      material: "Material",
      sizes: "O'lchamlar",
      colors: "Ranglar",
      care: "Parvarish ko'rsatmalari",
      requestQuote: "Narx so'rash",
    },
    contact: {
      title: "Biz bilan bog'laning",
      subtitle: "Savollaringiz bormi? Biz yordam berishga tayyormiz",
      name: "Ismingiz",
      email: "Email",
      phone: "Telefon",
      message: "Xabaringiz",
      send: "Yuborish",
      address: "Manzil",
      workingHours: "Ish vaqti",
    },
    chat: {
      title: "Yordam kerakmi?",
      placeholder: "Xabaringizni yozing...",
      send: "Yuborish",
      greeting: "Salom! Men Mary Collection yordamchisiman. Sizga qanday yordam bera olaman?",
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan",
      privacy: "Maxfiylik siyosati",
      terms: "Foydalanish shartlari",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      catalog: "Каталог",
      contact: "Контакты",
      bathrobes: "Халаты",
      towels: "Полотенца",
    },
    home: {
      heroTitle: "Роскошный домашний текстиль",
      heroSubtitle: "Изысканные халаты и полотенца из высококачественного хлопка в мягких пастельных тонах",
      shopCollection: "Смотреть коллекцию",
      contactUs: "Связаться с нами",
      philosophy: "Наша философия",
      philosophyText: "Mary Collection воплощает тихую роскошь и безупречное мастерство. Каждое изделие создано из премиального хлопка, привнося в ваш дом комфорт и элегантность.",
      featuredCollections: "Избранные коллекции",
      bathrobesCollection: "Коллекция халатов",
      bathrobesDesc: "Роскошные хлопковые халаты в мягких пастельных тонах",
      towelsCollection: "Коллекция полотенец",
      towelsDesc: "Изысканные полотенца для вашей роскошной ванной",
      whyUs: "Почему Mary Collection?",
      premiumCotton: "Премиальный хлопок",
      premiumCottonDesc: "Используется только хлопок высочайшего качества",
      pastelElegance: "Пастельная элегантность",
      pastelEleganceDesc: "Мягкие, изысканные цвета для любого интерьера",
      exportQuality: "Экспортное качество",
      exportQualityDesc: "Продукция соответствует международным стандартам",
      craftmanship: "Мастерство",
      craftmanshipDesc: "Внимание и забота в каждом стежке",
    },
    catalog: {
      title: "Наша коллекция",
      subtitle: "Роскошный домашний текстиль для вашего дома",
      filters: "Фильтры",
      category: "Категория",
      all: "Все",
      color: "Цвет",
      size: "Размер",
      requestInfo: "Запросить информацию",
    },
    product: {
      material: "Материал",
      sizes: "Размеры",
      colors: "Цвета",
      care: "Инструкции по уходу",
      requestQuote: "Запросить цену",
    },
    contact: {
      title: "Свяжитесь с нами",
      subtitle: "Есть вопросы? Мы готовы помочь",
      name: "Ваше имя",
      email: "Email",
      phone: "Телефон",
      message: "Сообщение",
      send: "Отправить",
      address: "Адрес",
      workingHours: "Часы работы",
    },
    chat: {
      title: "Нужна помощь?",
      placeholder: "Напишите сообщение...",
      send: "Отправить",
      greeting: "Здравствуйте! Я ассистент Mary Collection. Чем могу помочь?",
    },
    footer: {
      rights: "Все права защищены",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
    },
  },
  en: {
    nav: {
      home: "Home",
      catalog: "Catalog",
      contact: "Contact",
      bathrobes: "Bathrobes",
      towels: "Towels",
    },
    home: {
      heroTitle: "Luxury Home Textiles",
      heroSubtitle: "Exquisite bathrobes and towels crafted with premium cotton in soft pastel tones",
      shopCollection: "Shop Collection",
      contactUs: "Contact Us",
      philosophy: "Our Philosophy",
      philosophyText: "Mary Collection embodies quiet luxury and impeccable craftsmanship. Each piece is made from premium cotton, bringing comfort and elegance to your home.",
      featuredCollections: "Featured Collections",
      bathrobesCollection: "Bathrobes Collection",
      bathrobesDesc: "Luxurious cotton bathrobes in soft pastel colors",
      towelsCollection: "Towels Collection",
      towelsDesc: "Refined towels for your luxury bathroom",
      whyUs: "Why Mary Collection?",
      premiumCotton: "Premium Cotton",
      premiumCottonDesc: "Only the highest quality cotton is used",
      pastelElegance: "Pastel Elegance",
      pastelEleganceDesc: "Soft, refined colors for any interior",
      exportQuality: "Export Quality",
      exportQualityDesc: "Products meeting international standards",
      craftmanship: "Craftsmanship",
      craftmanshipDesc: "Attention and care in every stitch",
    },
    catalog: {
      title: "Our Collection",
      subtitle: "Luxury home textiles for your home",
      filters: "Filters",
      category: "Category",
      all: "All",
      color: "Color",
      size: "Size",
      requestInfo: "Request Information",
    },
    product: {
      material: "Material",
      sizes: "Sizes",
      colors: "Colors",
      care: "Care Instructions",
      requestQuote: "Request Quote",
    },
    contact: {
      title: "Contact Us",
      subtitle: "Have questions? We're here to help",
      name: "Your Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      send: "Send",
      address: "Address",
      workingHours: "Working Hours",
    },
    chat: {
      title: "Need Help?",
      placeholder: "Type your message...",
      send: "Send",
      greeting: "Hello! I'm Mary Collection's assistant. How can I help you?",
    },
    footer: {
      rights: "All rights reserved",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    },
  },
};

export function useTranslations() {
  const { language } = useLanguageStore();
  return translations[language];
}

export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  language: Language
): string {
  const key = `${field}${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof T;
  return (item[key] as string) || "";
}
