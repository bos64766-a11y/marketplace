import json
import logging
import urllib.request
import urllib.error
import re
from apps.settings_app.models import SiteSettings

logger = logging.getLogger(__name__)


def escape_html(text: str = '') -> str:
    if not text:
        return ''
    return (
        str(text)
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
    )


def format_number(num) -> str:
    try:
        n = int(round(float(num)))
        return f"{n:,}".replace(',', ' ')
    except (ValueError, TypeError):
        return str(num)


def clean_telegram_token(raw_token: str) -> str:
    if not raw_token:
        return ''
    token = raw_token.strip()
    if token.lower().startswith('bot'):
        token = token[3:].strip()
    return token


def clean_chat_ids(raw_chat_id: str) -> list[str]:
    if not raw_chat_id:
        return []
    parts = re.split(r'[\s,;]+', raw_chat_id.strip())
    valid = []
    for p in parts:
        p = p.strip()
        if p and (p.startswith('-') or p.isdigit() or p.startswith('@')):
            valid.append(p)
    return valid


def format_order_telegram_message(order) -> str:
    name = (order.customer_name or 'Mijoz').strip()
    phone = (order.customer_phone or 'Ko‘rsatilmadi').strip()
    company = (order.customer_company or '').strip()
    inn = (order.customer_inn or '').strip()
    comment = (order.comment or '').strip()

    msg = f"🔔 <b>YANGI B2B ZAYAVKA #{escape_html(str(order.id))}</b>\n"
    msg += f"━━━━━━━━━━━━━━━━━━━━\n\n"
    msg += f"👤 <b>Mijoz:</b> {escape_html(name)}\n"
    msg += f"📞 <b>Telefon:</b> <code>{escape_html(phone)}</code>\n"
    if company:
        msg += f"🏢 <b>Kompaniya:</b> {escape_html(company)}\n"
    if inn:
        msg += f"📋 <b>INN:</b> <code>{escape_html(inn)}</code>\n"
    if comment:
        msg += f"💬 <b>Izoh:</b> <i>{escape_html(comment)}</i>\n"

    items = list(order.items.all())
    msg += f"\n📦 <b>Buyurtma tarkibi ({len(items)} ta tovar):</b>\n"
    if items:
        for idx, it in enumerate(items, 1):
            p_name = it.product_name or (it.product.name if it.product else 'Tovar')
            qty = it.quantity or 1
            unit = it.product.unit if it.product and hasattr(it.product, 'unit') and it.product.unit else 'dona'
            price = float(it.price or 0)
            item_total = qty * price
            msg += f"{idx}. <b>{escape_html(p_name)}</b>\n"
            msg += f"   └ {qty} {escape_html(unit)} × {format_number(price)} so‘m = <b>{format_number(item_total)} so‘m</b>\n"
    else:
        msg += f"   <i>(Aloqa / Konsultatsiya so‘rovi)</i>\n"

    msg += f"\n━━━━━━━━━━━━━━━━━━━━\n"
    msg += f"💰 <b>JAMI SUMMA:</b> <b>{format_number(order.total_amount or 0)} so‘m</b>\n"
    created_str = order.created_at.strftime('%d.%m.%Y %H:%M') if hasattr(order, 'created_at') and order.created_at else ''
    if created_str:
        msg += f"📅 <b>Sana:</b> {escape_html(created_str)}\n"
    msg += f"🌐 <i>Manba: SNABTASH B2B Market</i>"

    return msg


def send_order_telegram_notification(order) -> bool:
    try:
        settings = SiteSettings.get_settings()
        token = clean_telegram_token(settings.telegram_bot_token)
        chat_ids = clean_chat_ids(settings.telegram_chat_id)

        if not token or not chat_ids:
            logger.info("Telegram bot token or chat ID not configured in SiteSettings; skipping.")
            return False

        message_text = format_order_telegram_message(order)
        success = False

        for chat_id in chat_ids:
            url = f"https://api.telegram.org/bot{token}/sendMessage"
            payload = json.dumps({
                'chat_id': chat_id,
                'text': message_text,
                'parse_mode': 'HTML',
                'disable_web_page_preview': True,
            }).encode('utf-8')

            req = urllib.request.Request(
                url,
                data=payload,
                headers={'Content-Type': 'application/json'},
                method='POST',
            )
            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    if resp.status == 200:
                        success = True
            except Exception as e:
                logger.warning(f"Telegram notification send error to chat {chat_id}: {e}")

        return success
    except Exception as exc:
        logger.error(f"Failed to send Telegram notification for order {order.id}: {exc}")
        return False
