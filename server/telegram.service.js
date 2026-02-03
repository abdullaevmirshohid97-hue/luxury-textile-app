import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

let bot = null;

if (TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function notifyAdminNewLead(lead) {
  if (!bot || !ADMIN_CHAT_ID) {
    return;
  }

  try {
    const message = `
<b>New Lead Received</b>

<b>Lead ID:</b> ${escapeHtml(lead.id)}
<b>Name:</b> ${escapeHtml(lead.name) || 'Not provided'}
<b>Phone:</b> ${escapeHtml(lead.phone) || 'Not provided'}
<b>Email:</b> ${escapeHtml(lead.email) || 'Not provided'}
<b>Source:</b> ${escapeHtml(lead.source) || 'Unknown'}
<b>Type:</b> ${escapeHtml(lead.leadType) || 'Unknown'}

<i>Reply to this message to answer the user</i>
`.trim();

    await bot.sendMessage(ADMIN_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error('[Telegram] Failed to send admin notification:', error.message);
  }
}

export default { notifyAdminNewLead };
