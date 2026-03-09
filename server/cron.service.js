import cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import { dbStorage } from './dbStorage.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

let cronInitialized = false;

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function initCronJobs() {
  if (cronInitialized) {
    console.log('[Cron] Already initialized, skipping');
    return;
  }

  if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.log('[Cron] Telegram not configured, skipping cron initialization');
    return;
  }

  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

  cron.schedule('0 21 * * *', async () => {
    try {
      const leads = await dbStorage.getLeadsToday();
      
      let message = `<b>Daily Lead Summary</b>\n\n`;
      message += `<b>Total leads today:</b> ${leads.length}\n\n`;

      if (leads.length > 0) {
        message += `<b>Lead list:</b>\n`;
        leads.forEach((lead, index) => {
          const name = escapeHtml(lead.name) || 'No name';
          const phone = escapeHtml(lead.phone) || 'No phone';
          message += `${index + 1}. ${name} - ${phone}\n`;
        });
      } else {
        message += `<i>No new leads today.</i>`;
      }

      await bot.sendMessage(ADMIN_CHAT_ID, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });

      console.log('[Cron] Daily lead summary sent');
    } catch (error) {
      console.error('[Cron] Failed to send daily summary:', error.message);
    }
  }, {
    timezone: 'Asia/Tashkent'
  });

  cronInitialized = true;
  console.log('[Cron] Daily lead summary scheduled for 21:00');
}

export default { initCronJobs };
