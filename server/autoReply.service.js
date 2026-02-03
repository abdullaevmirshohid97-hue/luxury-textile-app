const AUTO_REPLY_RULES = [
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'narx', 'qancha', 'цена', 'стоимость', 'сколько'],
    response: {
      en: 'For pricing information, please contact our sales team. Prices depend on order volume, customization requirements, and delivery terms. Minimum order: 500 units.',
      ru: 'Для информации о ценах, пожалуйста, свяжитесь с нашим отделом продаж. Цены зависят от объема заказа, требований к кастомизации и условий доставки. Минимальный заказ: 500 единиц.',
      uz: "Narxlar haqida ma'lumot olish uchun savdo bo'limimiz bilan bog'laning. Narxlar buyurtma hajmi, maxsuslashtirish talablari va yetkazib berish shartlariga bog'liq. Minimal buyurtma: 500 dona."
    }
  },
  {
    keywords: ['delivery', 'shipping', 'ship', 'доставка', 'yetkazib berish', 'transport'],
    response: {
      en: 'We offer international shipping with FOB/CIF terms. Standard delivery time is 4-6 weeks after production. Contact us for specific delivery options to your region.',
      ru: 'Мы предлагаем международную доставку на условиях FOB/CIF. Стандартный срок доставки 4-6 недель после производства. Свяжитесь с нами для уточнения вариантов доставки в ваш регион.',
      uz: "Biz FOB/CIF shartlari bilan xalqaro yetkazib berishni taklif qilamiz. Standart yetkazib berish muddati ishlab chiqarishdan keyin 4-6 hafta. Mintaqangizga yetkazib berish variantlari uchun biz bilan bog'laning."
    }
  },
  {
    keywords: ['production', 'manufacturing', 'lead time', 'how long', 'время', 'срок', 'ishlab chiqarish', 'muddat'],
    response: {
      en: 'Production lead time is typically 4-6 weeks for standard orders. Rush orders may be available. We offer sampling before full production commitment.',
      ru: 'Срок производства обычно составляет 4-6 недель для стандартных заказов. Возможны срочные заказы. Мы предлагаем образцы перед полным производством.',
      uz: "Ishlab chiqarish muddati standart buyurtmalar uchun odatda 4-6 hafta. Shoshilinch buyurtmalar mavjud bo'lishi mumkin. To'liq ishlab chiqarishdan oldin namunalar taklif qilamiz."
    }
  }
];

const processedMessages = new Set();
const MESSAGE_CACHE_TTL = 60000;

export function getAutoReply(message, language = 'en') {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const messageId = `${message.toLowerCase().trim()}`;
  
  if (processedMessages.has(messageId)) {
    return null;
  }

  const lowerMessage = message.toLowerCase();

  for (const rule of AUTO_REPLY_RULES) {
    const matched = rule.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );

    if (matched) {
      processedMessages.add(messageId);
      setTimeout(() => processedMessages.delete(messageId), MESSAGE_CACHE_TTL);

      return rule.response[language] || rule.response.en;
    }
  }

  return null;
}

export function shouldAutoReply(message) {
  return getAutoReply(message) !== null;
}

export default { getAutoReply, shouldAutoReply };
