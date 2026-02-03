import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

let bot = null;
let transporter = null;

if (TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
}

if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

export async function notifyUserViaTelegram(telegramId, message) {
  if (!bot || !telegramId) {
    return false;
  }

  try {
    await bot.sendMessage(telegramId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
    return true;
  } catch (error) {
    console.error('[UserNotify] Telegram send failed:', error.message);
    return false;
  }
}

export async function notifyUserViaEmail(email, subject, message) {
  if (!transporter || !email) {
    return false;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: subject,
      html: message,
    });
    return true;
  } catch (error) {
    console.error('[UserNotify] Email send failed:', error.message);
    return false;
  }
}

export async function notifyUser(lead, message) {
  const results = { telegram: false, email: false };

  if (lead.telegramId) {
    results.telegram = await notifyUserViaTelegram(lead.telegramId, message);
  }

  if (lead.email && !results.telegram) {
    results.email = await notifyUserViaEmail(
      lead.email,
      'Mary Collection - Response to Your Inquiry',
      `<p>${message}</p>`
    );
  }

  return results;
}

export default { notifyUserViaTelegram, notifyUserViaEmail, notifyUser };
