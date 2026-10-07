/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequestOrder, SiteSettings } from '../types';

/**
 * Escapes HTML characters for Telegram HTML parse_mode
 */
function escapeHtml(text: string = ''): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Formats a number with spaces (e.g. 1 250 000)
 */
function formatNumber(num: number): string {
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Cleans the Telegram bot token by stripping accidental "bot" prefix or extra whitespace
 */
export function cleanTelegramToken(rawToken?: string): string {
  if (!rawToken) return '';
  let token = rawToken.trim();
  if (token.toLowerCase().startsWith('bot')) {
    token = token.slice(3).trim();
  }
  return token;
}

/**
 * Splits comma, semicolon, space, or newline-separated chat IDs
 */
export function cleanChatIds(rawChatId?: string): string[] {
  if (!rawChatId) return [];
  return rawChatId
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => Boolean(s) && (s.startsWith('-') || /^\d+$/.test(s) || s.startsWith('@')));
}

/**
 * Generates an attractive, professional HTML message for Telegram
 */
export function formatOrderMessage(order: RequestOrder): string {
  const name = order.contact?.name?.trim() || 'Mijoz';
  const phone = order.contact?.phone?.trim() || 'Ko‘rsatilmadi';
  const company = order.contact?.company?.trim();
  const inn = order.contact?.inn?.trim();
  const comment = order.contact?.comment?.trim();

  let msg = `🔔 <b>YANGI B2B ZAYAVKA #${escapeHtml(order.id)}</b>\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Contact details
  msg += `👤 <b>Mijoz:</b> ${escapeHtml(name)}\n`;
  msg += `📞 <b>Telefon:</b> <code>${escapeHtml(phone)}</code>\n`;
  if (company) {
    msg += `🏢 <b>Kompaniya:</b> ${escapeHtml(company)}\n`;
  }
  if (inn) {
    msg += `📋 <b>INN:</b> <code>${escapeHtml(inn)}</code>\n`;
  }
  if (comment) {
    msg += `💬 <b>Izoh:</b> <i>${escapeHtml(comment)}</i>\n`;
  }

  msg += `\n📦 <b>Buyurtma tarkibi (${order.items?.length || 0} ta tovar):</b>\n`;

  if (order.items && order.items.length > 0) {
    order.items.forEach((item, idx) => {
      const pName = item.product?.name || 'Mahsulot';
      const qty = item.quantity || 1;
      const unit = item.product?.unit || 'dona';
      const price = item.product?.price || 0;
      const itemTotal = qty * price;

      msg += `${idx + 1}. <b>${escapeHtml(pName)}</b>\n`;
      msg += `   └ ${qty} ${escapeHtml(unit)} × ${formatNumber(price)} so‘m = <b>${formatNumber(itemTotal)} so‘m</b>\n`;
    });
  } else {
    msg += `   <i>(Aloqa / Konsultatsiya so‘rovi)</i>\n`;
  }

  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 <b>JAMI SUMMA:</b> <b>${formatNumber(order.totalAmount || 0)} so‘m</b>\n`;
  msg += `📅 <b>Sana:</b> ${escapeHtml(order.date || new Date().toLocaleDateString('uz-UZ'))}\n`;
  msg += `🌐 <i>Manba: SNABTASH B2B Market</i>`;

  return msg;
}

/**
 * Sends order notification to all configured Telegram chats
 */
export async function sendTelegramOrderNotification(
  order: RequestOrder,
  settings: SiteSettings
): Promise<boolean> {
  let token = cleanTelegramToken(settings.telegramBotToken);
  let chatIds = cleanChatIds(settings.telegramChatId);

  // 1. Fallback to localStorage if state was not yet reloaded
  if (!token || chatIds.length === 0) {
    try {
      const raw = localStorage.getItem('snabtash_site_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!token && parsed.telegramBotToken) token = cleanTelegramToken(parsed.telegramBotToken);
        if (chatIds.length === 0 && parsed.telegramChatId) chatIds = cleanChatIds(parsed.telegramChatId);
      }
    } catch {}
  }

  // 2. Fallback to backend settings API if customer browser does not have local settings
  if (!token || chatIds.length === 0) {
    try {
      const backendSettings = await fetch('/api/settings/')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      if (backendSettings) {
        if (!token && backendSettings.telegramBotToken) token = cleanTelegramToken(backendSettings.telegramBotToken);
        if (chatIds.length === 0 && backendSettings.telegramChatId) chatIds = cleanChatIds(backendSettings.telegramChatId);
      }
    } catch {}
  }

  if (!token || chatIds.length === 0) {
    console.warn('Telegram bot token or chat ID not configured, skipping notification');
    return false;
  }

  const messageText = formatOrderMessage(order);
  let anySuccess = false;

  for (const chatId of chatIds) {
    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      if (res.ok) {
        anySuccess = true;
      } else {
        const errJson = await res.json().catch(() => null);
        console.warn(`Telegram send error for chat ${chatId}:`, errJson);
      }
    } catch (err) {
      console.warn(`Telegram fetch network error for chat ${chatId}:`, err);
    }
  }

  return anySuccess;
}

/**
 * Validates bot token and sends a test message to verify the connection
 */
export async function sendTelegramTestMessage(
  rawToken: string,
  rawChatId: string
): Promise<{ success: boolean; message: string; botName?: string }> {
  const token = cleanTelegramToken(rawToken);
  const chatIds = cleanChatIds(rawChatId);

  if (!token) {
    return {
      success: false,
      message: 'Telegram Bot Token kiritilmadi. Iltimos, @BotFather bergan tokenni kiriting.',
    };
  }

  if (chatIds.length === 0) {
    return {
      success: false,
      message: 'Telegram Chat ID kiritilmadi. Shaxsiy yoki guruh ID raqamini kiriting.',
    };
  }

  try {
    // 1. Verify token by calling getMe
    const getMeRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await getMeRes.json().catch(() => null);

    if (!getMeRes.ok || !meData?.ok) {
      const desc = meData?.description || 'Token noto‘g‘ri yoki bekor qilingan';
      return {
        success: false,
        message: `Bot token xato (${desc}). @BotFather dan tokenni qayta tekshiring.`,
      };
    }

    const botName = `@${meData.result?.username || 'bot'}`;

    // 2. Send test message to all chat IDs
    const testText =
      `🎉 <b>SNABTASH B2B — Telegram Bot Aloqasi O‘rnatildi!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ <b>Bot:</b> ${escapeHtml(botName)}\n` +
      `✅ <b>Holati:</b> Muvaffaqiyatli ulandi!\n\n` +
      `📦 Endi sayt orqali kelib tushadigan barcha yangi B2B zayavkalar va buyurtmalar darhol ushbu chatga kelib tushadi.\n\n` +
      `⏰ <i>Sinov vaqti: ${new Date().toLocaleString('uz-UZ')}</i>`;

    const errors: string[] = [];
    let sentCount = 0;

    for (const chatId of chatIds) {
      const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: testText,
          parse_mode: 'HTML',
        }),
      });

      const sendData = await sendRes.json().catch(() => null);

      if (sendRes.ok && sendData?.ok) {
        sentCount++;
      } else {
        const desc = sendData?.description || 'Noma’lum xatolik';
        errors.push(`Chat ID "${chatId}": ${desc}`);
      }
    }

    if (sentCount > 0) {
      return {
        success: true,
        message: `✓ Test xabari Telegramga muvaffaqiyatli yuborildi! (${botName})`,
        botName,
      };
    }

    return {
      success: false,
      message: `Xabar yuborilmadi: ${errors.join('; ')}. Botga /start bosganingizni va chat ID to‘g‘riligini tekshiring.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Tarmoq xatoligi yuz berdi (${err.message || 'Telegram serveriga ulanib bo‘lmadi'}).`,
    };
  }
}
