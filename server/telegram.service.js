import TelegramBot from 'node-telegram-bot-api';
import { dbStorage } from './dbStorage.js';
import { notifyUser } from './userNotify.service.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

let bot = null;
let pollingStarted = false;

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function initTelegramBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log('[Telegram] No bot token configured, skipping initialization');
    return null;
  }

  if (bot && pollingStarted) {
    return bot;
  }

  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
  pollingStarted = true;

  bot.on('polling_error', (error) => {
    console.error('[Telegram] Polling error:', error.message);
  });

  bot.onText(/\/start lead_(\d+)/, async (msg, match) => {
    try {
      const leadId = parseInt(match[1], 10);
      const telegramId = String(msg.from.id);

      const lead = await dbStorage.getLead(leadId);
      if (!lead) {
        await bot.sendMessage(msg.chat.id, 'Invalid link. Please contact support.');
        return;
      }

      await dbStorage.updateLeadTelegramId(leadId, telegramId);

      await bot.sendMessage(msg.chat.id, 
        'Your Telegram account has been linked successfully. You will receive responses here.',
        { parse_mode: 'HTML' }
      );

      if (ADMIN_CHAT_ID) {
        await bot.sendMessage(ADMIN_CHAT_ID,
          `<b>Lead #${leadId}</b> linked their Telegram account.`,
          { parse_mode: 'HTML' }
        );
      }
    } catch (error) {
      console.error('[Telegram] Error handling /start command:', error.message);
      try {
        await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again later.');
      } catch (e) {
        console.error('[Telegram] Failed to send error message:', e.message);
      }
    }
  });

  bot.on('message', async (msg) => {
    try {
      if (!msg.reply_to_message || String(msg.chat.id) !== ADMIN_CHAT_ID) {
        return;
      }

      const originalText = msg.reply_to_message.text || '';
      const leadIdMatch = originalText.match(/Lead ID:<\/b>\s*(\d+)/i) || originalText.match(/Lead #(\d+)/);
      
      if (!leadIdMatch) {
        return;
      }

      const leadId = parseInt(leadIdMatch[1], 10);
      const lead = await dbStorage.getLead(leadId);

      if (!lead) {
        await bot.sendMessage(ADMIN_CHAT_ID, `Lead #${leadId} not found.`);
        return;
      }

      const adminReply = msg.text;
      const results = await notifyUser(lead, adminReply);

      let statusMessage = `Reply to Lead #${leadId}:\n`;
      if (results.telegram) {
        statusMessage += 'Delivered via Telegram.';
      } else if (results.email) {
        statusMessage += 'Delivered via Email.';
      } else {
        statusMessage += 'Could not deliver. No Telegram or Email available.';
      }

      await bot.sendMessage(ADMIN_CHAT_ID, statusMessage);
    } catch (error) {
      console.error('[Telegram] Error handling admin reply:', error.message);
      try {
        await bot.sendMessage(ADMIN_CHAT_ID, 'Failed to send reply. Please try again.');
      } catch (e) {
        console.error('[Telegram] Failed to send error message:', e.message);
      }
    }
  });

  console.log('[Telegram] Bot initialized with polling');
  return bot;
}

export async function notifyAdminNewLead(lead) {
  if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
    return;
  }

  const sendBot = bot || new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

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

    await sendBot.sendMessage(ADMIN_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error('[Telegram] Failed to send admin notification:', error.message);
  }
}

export default { initTelegramBot, notifyAdminNewLead };
