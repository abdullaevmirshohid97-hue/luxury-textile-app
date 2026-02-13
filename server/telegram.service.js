import TelegramBot from 'node-telegram-bot-api';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function notifyAdminNewLead(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  try {
    const bot = new TelegramBot(token, { polling: false });

    const message = `
<b>New Lead Received</b>

<b>Name:</b> ${escapeHtml(lead.name) || 'Not provided'}
<b>Phone:</b> ${escapeHtml(lead.phone) || 'Not provided'}
<b>Email:</b> ${escapeHtml(lead.email) || 'Not provided'}
<b>Source:</b> ${escapeHtml(lead.source) || 'Contact Form'}
`.trim();

    await bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error('[Telegram] Failed to send notification:', error.message);
  }
}

export async function notifyAdminContactMessage(msg) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  try {
    const bot = new TelegramBot(token, { polling: false });

    const message = `
<b>New Contact Form Submission</b>

<b>Name:</b> ${escapeHtml(msg.name)}
<b>Phone:</b> ${escapeHtml(msg.phone) || 'Not provided'}
<b>Email:</b> ${escapeHtml(msg.email) || 'Not provided'}
<b>Message:</b> ${escapeHtml(msg.message)}
`.trim();

    await bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error('[Telegram] Failed to send contact notification:', error.message);
  }
}

export default { notifyAdminNewLead, notifyAdminContactMessage };
