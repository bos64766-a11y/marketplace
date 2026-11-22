import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const DOMAIN = 'https://www.snab.uz';

// List of Russian Static Pages with targeted SEO tags for Google Ads & search engines
const RUSSIAN_PAGES = [
  {
    fileName: 'index-ru.html', // Universal fallback for /ru and /ru/:path*
    canonicalPath: '/ru',
    title: 'SNAB.UZ — B2B Снабжение и Оптовая Торговля в Ташкенте | SNABTASH',
    metaTitle: 'SNAB.UZ — B2B Снабжение и Оптовая Торговля в Ташкенте | SNABTASH',
    description:
      'SNAB.UZ (SNABTASH) — Оптовые поставки бытовой химии, моющих средств, хозтоваров и канцтоваров для офисов, предприятий и клининговых компаний Ташкента. Быстрая доставка, оплата по перечислению с НДС через Didox.',
    keywords:
      'снаб, снаб уз, снаб.уз, снабжение ташкент, оптом бытовая химия, хозтовары оптом, канцтовары ташкент, snab, snab uz, snab.uz, b2b снабжение, оптовый склад ташкент, моющие средства оптом, snab b2b',
    h1: 'SNAB.UZ — B2B Снабжение и Оптовая Торговля в Ташкенте',
    leadText:
      'Профессиональное комплексное снабжение предприятий, клининговых служб, отелей, ресторанов и офисов Узбекистана. Прямые поставки со склада в Ташкенте, оплата с НДС 12% через Didox.',
  },
  {
    fileName: 'ru-catalog.html',
    canonicalPath: '/ru/catalog',
    title: 'Каталог B2B Товаров — Оптовые Поставки в Ташкенте | SNAB.UZ',
    metaTitle: 'Каталог B2B Товаров — Оптовые Поставки в Ташкенте | SNAB.UZ',
    description:
      'Полный каталог B2B товаров для предприятий Ташкента: профессиональная бытовая химия, хозтовары, средства индивидуальной защиты, бумага и канцтовары. Доставка с НДС.',
    keywords:
      'каталог снаб, каталог snab uz, оптовые товары ташкент, бытовая химия каталог, канцтовары оптом, хозтовары ташкент, средства защиты оптом',
    h1: 'Каталог B2B Продукции и Расходных Материалов | SNAB.UZ',
    leadText:
      'Широкий ассортимент товаров для юридических лиц: моющие средства, инвентарь для уборки, средства индивидуальной защиты, офисная канцелярия и автохимия.',
  },
  {
    fileName: 'ru-delivery.html',
    canonicalPath: '/ru/delivery-payment',
    title: 'Доставка и Оплата — Условия для Юридических Лиц с НДС | SNAB.UZ',
    metaTitle: 'Доставка и Оплата — Условия для Юридических Лиц с НДС | SNAB.UZ',
    description:
      'Условия оптовой доставки и оплаты для юридических лиц в Ташкенте. Бесплатная доставка от 500 000 сум, оплата по перечислению с НДС 12% через Didox.',
    keywords:
      'доставка хозтоваров ташкент, оплата с ндс didox, b2b доставка ташкент, оптовая доставка snab, безналичный расчет узбекистан',
    h1: 'Условия Доставки и Оплаты для Корпоративных Клиентов',
    leadText:
      'Оперативная доставка по Ташкенту прямо до вашего склада или офиса. Бесплатно при заказе от 500 000 сум. Полный пакет закрывающих документов с НДС.',
  },
  {
    fileName: 'ru-about.html',
    canonicalPath: '/ru/about',
    title: 'О Компании SNAB.UZ — Комплексное B2B Снабжение в Узбекистане',
    metaTitle: 'О Компании SNAB.UZ — Комплексное B2B Снабжение в Узбекистане',
    description:
      'SNAB.UZ (SNABTASH) — надежный оптовый партнер для бизнеса и предприятий Узбекистана. Прямые поставки бытовой химии, канцтоваров и хозтоваров со склада в Ташкенте.',
    keywords:
      'о компании snab uz, snabtash ташкент, b2b поставщик узбекистан, оптовая компания ташкент, снабжение предприятий',
    h1: 'О Компании SNAB.UZ (SNABTASH)',
    leadText:
      'SNAB.UZ — специализированная платформа оптовых поставок и снабжения для корпоративного сектора Узбекистана. Объединяем широкий ассортимент от проверенных производителей в единую удобную систему.',
  },
  {
    fileName: 'ru-contacts.html',
    canonicalPath: '/ru/contacts',
    title: 'Контакты и Склад в Ташкенте — Оптовые Поставки | SNAB.UZ',
    metaTitle: 'Контакты и Склад в Ташкенте — Оптовые Поставки | SNAB.UZ',
    description:
      'Контакты B2B платформы SNAB.UZ: адрес оптового склада в Ташкенте, телефоны отдела продаж (+998 87 034 97 79), Telegram-бот и время работы.',
    keywords:
      'контакты snab uz, склад snabtash ташкент, телефон отдела снабжения, адрес склада чиланзар, snab tashkent contacts',
    h1: 'Контакты Отдела Продаж и Склада SNAB.UZ',
    leadText:
      'г. Ташкент, Чиланзарский район, проспект Бунёдкор, 42-й дом. Отдел корпоративных продаж: +998 87 034 97 79.',
  },
  {
    fileName: 'ru-request.html',
    canonicalPath: '/ru/request',
    title: 'Оставить Заявку на Снабжение — Оптовый Расчет с НДС | SNAB.UZ',
    metaTitle: 'Оставить Заявку на Снабжение — Оптовый Расчет с НДС | SNAB.UZ',
    description:
      'Отправьте заявку на оптовую закупку для вашей организации. Быстрый расчет коммерческого предложения с НДС, персональный менеджер и оперативная доставка.',
    keywords:
      'заявка снабжение ташкент, b2b заявка snab, оптовый заказ ташкент, коммерческое предложение бытовая химия, расчет поставки',
    h1: 'Оформление Заявки на B2B Снабжение | SNAB.UZ',
    leadText:
      'Отправьте перечень необходимых товаров, и наш менеджер оперативно сформирует коммерческое предложение и счет-фактуру с НДС.',
  },

  // 7 Core Categories
  {
    fileName: 'ru-cat-maishiy-kimyo.html',
    canonicalPath: '/ru/catalog/maishiy-kimyo',
    title: 'Бытовая химия оптом в Ташкенте | Каталог SNAB.UZ',
    metaTitle: 'Бытовая химия оптом в Ташкенте | Каталог SNAB.UZ',
    description:
      'Профессиональные моющие и чистящие средства, жидкое мыло, хлорные растворы оптом для организаций Ташкента. Доставка со склада с НДС.',
    keywords: 'бытовая химия оптом, моющие средства ташкент, жидкое мыло оптом, хлорка ташкент, белизна оптом snab',
    h1: 'Профессиональная Бытовая Химия Оптом | SNAB.UZ',
    leadText: 'Моющие гели, средства для мытья посуды, дезинфекция, жидкое мыло и чистящие порошки по оптовым ценам с доставкой по Ташкенту.',
  },
  {
    fileName: 'ru-cat-xojalikmollari.html',
    canonicalPath: '/ru/catalog/xojalikmollari',
    title: 'Хозтовары и уборочный инвентарь оптом в Ташкенте | SNAB.UZ',
    metaTitle: 'Хозтовары и уборочный инвентарь оптом в Ташкенте | SNAB.UZ',
    description:
      'Ведра, совки, веники, мешки для мусора и хозяйственные товары оптом для предприятий и клининга в Ташкенте. Выгодные цены с НДС.',
    keywords: 'хозтовары оптом ташкент, мешки для мусора оптом, ведра пластиковые, веники оптом, уборочный инвентарь snab',
    h1: 'Хозяйственные Товары и Инвентарь Оптом | SNAB.UZ',
    leadText: 'Уборочный инвентарь, пакеты для мусора, ведра, швабры и расходные хозтовары для гостиниц, офисов и производств.',
  },
  {
    fileName: 'ru-cat-kanselyariya.html',
    canonicalPath: '/ru/catalog/kanselyariya',
    title: 'Канцтовары и бумага А4 для офиса оптом в Ташкенте | SNAB.UZ',
    metaTitle: 'Канцтовары и бумага А4 для офиса оптом в Ташкенте | SNAB.UZ',
    description:
      'Офисная бумага SvetoCopy, Double A, папки, ручки и канцелярские расходные материалы оптом для офисов с доставкой по Ташкенту.',
    keywords: 'бумага а4 оптом ташкент, svetocopy оптом, канцтовары для офиса, папки скоросшиватели оптом, канцелярия snab',
    h1: 'Офисная Канцелярия и Бумага А4 Оптом | SNAB.UZ',
    leadText: 'Бумага для принтеров формата А4, ручки, папки-регистраторы, файлы, степлеры и полный комплект канцелярии для вашего офиса.',
  },
  {
    fileName: 'ru-cat-gigiyena.html',
    canonicalPath: '/ru/catalog/gigiyena',
    title: 'Гигиенические средства и расходные материалы оптом | SNAB.UZ',
    metaTitle: 'Гигиенические средства и расходные материалы оптом | SNAB.UZ',
    description:
      'Бумажные полотенца, туалетная бумага, салфетки, диспенсеры и антисептики оптом для заведений HoReCa, офисов и клиник Ташкента.',
    keywords: 'бумажные полотенца оптом, туалетная бумага джамбо, салфетки оптом ташкент, диспенсеры для полотенец snab',
    h1: 'Гигиеническая Продукция и Бумажные Изделия Оптом | SNAB.UZ',
    leadText: 'Листовые и рулонные полотенца Z/V сложения, туалетная бумага в больших рулонах, салфетки и мыло для санитарных зон.',
  },
  {
    fileName: 'ru-cat-himoya-vositalari.html',
    canonicalPath: '/ru/catalog/himoya-vositalari',
    title: 'Средства индивидуальной защиты и рабочие перчатки оптом | SNAB.UZ',
    metaTitle: 'Средства индивидуальной защиты и рабочие перчатки оптом | SNAB.UZ',
    description:
      'Хлопчатобумажные, нитриловые и латексные рабочие перчатки, респираторы, защитные очки и спецодежда от прямого поставщика в Ташкенте.',
    keywords: 'рабочие перчатки оптом, перчатки хб ташкент, перчатки нитриловые оптом, респираторы сиз ташкент, сиз оптом snab',
    h1: 'Средства Индивидуальной Защиты (СИЗ) и Перчатки Оптом',
    leadText: 'ХБ перчатки с ПВХ напылением, нитриловые маслобензостойкие перчатки, защитные щитки и респираторы для строительных и производственных объектов.',
  },
  {
    fileName: 'ru-cat-avtokimyo.html',
    canonicalPath: '/ru/catalog/avtokimyo',
    title: 'Автохимия и автокосметика оптом для моек и сервисов | SNAB.UZ',
    metaTitle: 'Автохимия и автокосметика оптом для моек и сервисов | SNAB.UZ',
    description:
      'Автошампуни для бесконтактной мойки, омыватели стекол, полироли и профессиональная химия для автосервисов Ташкента со склада.',
    keywords: 'автохимия оптом ташкент, автошампунь для бесконтактной мойки, омыватель стекол оптом, автокосметика snab',
    h1: 'Автохимия и Средства для Автосервисов Оптом | SNAB.UZ',
    leadText: 'Активная пена, очистители дисков, чернение резины, полироли панели и стеклоомыватели для автомоек, таксопарков и автопредприятий.',
  },
  {
    fileName: 'ru-cat-tekstil-mahsulotlari.html',
    canonicalPath: '/ru/catalog/tekstil-mahsulotlari',
    title: 'Текстиль и салфетки из микрофибры оптом в Ташкенте | SNAB.UZ',
    metaTitle: 'Текстиль и салфетки из микрофибры оптом в Ташкенте | SNAB.UZ',
    description:
      'Микрофибра, вафельные полотенца, мопы и уборочные полотна оптом со склада в Ташкенте с доставкой и закрывающими документами с НДС.',
    keywords: 'микрофибра оптом ташкент, тряпки для уборки оптом, мопы для швабры, вафельное полотно оптом snab',
    h1: 'Уборочный Текстиль и Микрофибра Оптом | SNAB.UZ',
    leadText: 'Салфетки из микрофибры различных плотностей, насадки для плоских и веревочных мопов, технические ткани для профессионального клининга.',
  },
];

function replaceMetaByName(html, name, newContent) {
  const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][\\s\\S]*?["']\\s*\\/?>`, 'i');
  return html.replace(regex, `<meta name="${name}" content="${newContent}" />`);
}

function replaceMetaByProperty(html, property, newContent) {
  const regex = new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["'][\\s\\S]*?["']\\s*\\/?>`, 'i');
  return html.replace(regex, `<meta property="${property}" content="${newContent}" />`);
}

function generateRussianHtml(templateHtml, page) {
  let html = templateHtml;

  // 1. Replace <html lang="uz"> with <html lang="ru">
  html = html.replace(/<html(\s+[^>]*)lang=["']uz["']([^>]*)>/i, '<html$1lang="ru"$2>');
  if (!html.includes('lang="ru"')) {
    html = html.replace(/<html([^>]*)>/i, '<html lang="ru"$1>');
  }

  // 2. Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`);

  // 3. Replace <meta name="title" ...>
  html = replaceMetaByName(html, 'title', page.metaTitle);

  // 4. Replace <meta name="description" ...>
  html = replaceMetaByName(html, 'description', page.description);

  // 5. Replace <meta name="keywords" ...>
  html = replaceMetaByName(html, 'keywords', page.keywords);

  // 6. Replace <link rel="canonical" ...>
  const fullCanonicalUrl = `${DOMAIN}${page.canonicalPath}`;
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${fullCanonicalUrl}" />`
  );

  // 7. Update Open Graph tags for Russian
  html = replaceMetaByProperty(html, 'og:url', fullCanonicalUrl);
  html = replaceMetaByProperty(html, 'og:title', page.metaTitle);
  html = replaceMetaByProperty(html, 'og:description', page.description);
  html = replaceMetaByProperty(html, 'og:locale', 'ru_RU');

  // 8. Update Twitter Card tags for Russian
  html = replaceMetaByName(html, 'twitter:url', fullCanonicalUrl);
  html = replaceMetaByName(html, 'twitter:title', page.metaTitle);
  html = replaceMetaByName(html, 'twitter:description', page.description);

  // 9. Update JSON-LD structured data description and language if present
  html = html.replace(
    /"description":\s*"O'zbekiston korxona[^"]*"/g,
    `"description": "Профессиональное B2B снабжение предприятий и организаций Ташкента и Узбекистана (SNAB.UZ / SNABTASH)."`
  );

  // 10. Update noscript fallback semantic content with Russian text
  const noscriptContent = `
    <noscript>
      <div style="padding: 24px; font-family: sans-serif; max-width: 1200px; margin: 0 auto; color: #14213D;">
        <h1>${page.h1}</h1>
        <p>${page.leadText}</p>
        
        <h2>Категории Товаров для Предприятий (Каталог SNAB.UZ)</h2>
        <ul>
          <li><a href="/ru/catalog/maishiy-kimyo">Бытовая химия оптом (жидкое мыло, моющие средства, хлор, дезинфекция)</a></li>
          <li><a href="/ru/catalog/xojalikmollari">Хозтовары оптом (ведра, совки, веники, мешки для мусора)</a></li>
          <li><a href="/ru/catalog/kanselyariya">Канцтовары для офиса оптом (бумага А4, папки, ручки)</a></li>
          <li><a href="/ru/catalog/gigiyena">Гигиенические средства (бумажные полотенца, туалетная бумага, салфетки)</a></li>
          <li><a href="/ru/catalog/himoya-vositalari">Средства индивидуальной защиты (рабочие перчатки х/б и нитрил, СИЗ)</a></li>
          <li><a href="/ru/catalog/avtokimyo">Автохимия оптом (автошампуни, омыватели стекол, полироли)</a></li>
          <li><a href="/ru/catalog/tekstil-mahsulotlari">Текстиль и салфетки из микрофибры (мопы, уборочные салфетки)</a></li>
        </ul>

        <h2>Услуги и Корпоративная Информация</h2>
        <ul>
          <li><a href="/ru/catalog">Полный каталог 100+ товаров</a></li>
          <li><a href="/ru/delivery-payment">Условия доставки и безналичная оплата с НДС 12% через Didox</a></li>
          <li><a href="/ru/about">О компании SNAB.UZ</a></li>
          <li><a href="/ru/contacts">Контакты, адрес оптового склада и телефоны отдела продаж</a></li>
          <li><a href="/ru/request">Оставить заявку на снабжение онлайн</a></li>
        </ul>
      </div>
    </noscript>
  `;

  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, noscriptContent.trim());

  return html;
}

function run() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  console.log(`Generating ${RUSSIAN_PAGES.length} Russian static HTML pages for server-side lang="ru" delivery...`);

  let count = 0;
  for (const page of RUSSIAN_PAGES) {
    const targetPath = path.join(distDir, page.fileName);
    const russianHtml = generateRussianHtml(templateHtml, page);
    fs.writeFileSync(targetPath, russianHtml, 'utf8');
    console.log(`  ✓ Created: dist/${page.fileName} (lang="ru", title: "${page.title.slice(0, 45)}...")`);
    count++;
  }

  console.log(`✅ Successfully generated ${count} Russian HTML pages in dist/!`);
}

run();
