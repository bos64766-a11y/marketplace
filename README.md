<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3bb167fd-26cd-4c70-ae98-adc4a65be3bf

## Run Locally

**Prerequisites:**  Node.js


## Аналитика (Yandex Metrika)

На сайте настроен счётчик **Яндекс Метрики** для отслеживания просмотров страниц и целей конверсий в Яндекс Директ.

- **Номер счётчика:** `114479664`
- **Переменные окружения:**
  - `VITE_YM_ID` — ID счётчика (по умолчанию: `114479664`).
  - `VITE_YM_FORCE` — флаг принудительного включения в локальном режиме разработки `npm run dev` (`true` / `false`, по умолчанию `false`). В обычном dev-режиме запросы на `mc.yandex.ru` блокируются.
- **Маршруты админки:** любые переходы на `/admin/*` игнорируются счётчиком.
- **Защита персональных данных (PII):** поля форм помечены классом `ym-disable-keys`, параметры пользователя не отправляются.

### Цели конверсий

| Цель | Описание | Точка вызова | Параметры |
|---|---|---|---|
| `add_to_cart` | Добавление товара в корзину | `src/context/AppContext.tsx` (`addToCart`) | `product_id`, `price` (целое, сум), `quantity`, `currency: 'UZS'` |
| `order_start` | Клик «Zayavkani tasdiqlash» на `/request` | `src/pages/RequestPage.tsx` (`handleSubmit`) | `items_count`, `order_price`, `currency: 'UZS'`, `lang` |
| `order_success` | Успешное оформление заявки после ответа сервера | `src/pages/RequestPage.tsx` (`handleSubmit`) | `order_id`, `order_price`, `currency: 'UZS'`, `items_count`, `lang` |
| `contact_form_sent` | Успешная отправка формы на `/contacts` | `src/pages/ContactsPage.tsx` (`handleSubmit`) | `lang` |

