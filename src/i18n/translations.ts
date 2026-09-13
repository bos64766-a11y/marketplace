import { Language } from '../types';

export interface Translations {
  header: {
    deliveryRegion: string;
    contractGuarantee: string;
    workHours: string;
    catalog: string;
    searchPlaceholder: string;
    favorites: string;
    cart: string;
    quickRequest: string;
    ordersHistory: string;
    popularCategories: string;
    allCategories: string;
    close: string;
  };
  catalogPage: {
    title: string;
    allProducts: string;
    found: string;
    filters: string;
    categories: string;
    price: string;
    inStockOnly: string;
    popularOnly: string;
    newOnly: string;
    resetFilters: string;
    sortBy: string;
    sortPopular: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortName: string;
    noProducts: string;
    noProductsDesc: string;
  };
  productCard: {
    inStock: string;
    outOfStock: string;
    minOrder: string;
    addToCart: string;
    inCart: string;
    quickOrder: string;
    sum: string;
  };
  productDetail: {
    sku: string;
    brand: string;
    category: string;
    unitPrice: string;
    description: string;
    characteristics: string;
    b2bNotice: string;
    similarProducts: string;
    quantity: string;
    total: string;
    backToCatalog: string;
    deliveryInfo: string;
    paymentInfo: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    toCatalog: string;
    itemsCount: string;
    clearCart: string;
    orderSummary: string;
    subtotal: string;
    delivery: string;
    free: string;
    freeDeliveryNotice: string;
    total: string;
    checkout: string;
    continueShopping: string;
  };
  checkout: {
    title: string;
    contactInfo: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    company: string;
    companyPlaceholder: string;
    inn: string;
    comment: string;
    commentPlaceholder: string;
    b2bGuarantee: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    orderNumber: string;
    backHome: string;
  };
  footer: {
    aboutDesc: string;
    catalogTitle: string;
    companyTitle: string;
    aboutUs: string;
    deliveryPayment: string;
    contacts: string;
    adminLogin: string;
    rights: string;
    servicesTitle: string;
    allCatalog: string;
    leaveRequest: string;
    myRequests: string;
    ordersHistory: string;
    contactCenter: string;
    b2bContractEfactura: string;
    availableProducts: string;
  };
  mobileNav: {
    home: string;
    catalog: string;
    favorites: string;
    cart: string;
    requests: string;
  };
  home: {
    showcaseTitle: string;
    showcaseSubtitle: string;
    popularProducts: string;
    newProducts: string;
    viewAll: string;
    ourPartners: string;
    partnersSubtitle: string;
    b2bOffer: string;
    allSupplies: string;
    orderNow: string;
  };
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    yes: string;
    no: string;
  };
}

export const translations: Record<Language, Translations> = {
  uz: {
    header: {
      deliveryRegion: "Yetkazib berish: Butun O‘zbekiston",
      contractGuarantee: "100% rasmiy shartnoma, QQS va Didox e-faktura",
      workHours: "Dush – Shan: 08:30 – 18:30",
      catalog: "Katalog",
      searchPlaceholder: "Tovar nomi, artikul yoki brend bo‘yicha qidiruv...",
      favorites: "Saralanganlar",
      cart: "Savatcha",
      quickRequest: "Tezkor zayavka",
      ordersHistory: "Buyurtmalarim",
      popularCategories: "Ommabop bo‘limlar",
      allCategories: "Barcha kategoriyalar",
      close: "Yopish",
    },
    catalogPage: {
      title: "Katalog",
      allProducts: "Barcha tovarlar",
      found: "ta tovar topildi",
      filters: "Filtrlar",
      categories: "Kategoriyalar",
      price: "Narx (so‘m)",
      inStockOnly: "Faqat omborda borlar",
      popularOnly: "Ommabop tovarlar",
      newOnly: "Yangi tovarlar",
      resetFilters: "Filtrlarni tozalash",
      sortBy: "Saralash",
      sortPopular: "Ommabopligi bo‘yicha",
      sortPriceAsc: "Arzondan qimmatga",
      sortPriceDesc: "Qimmatdan arzonga",
      sortName: "Alifbo bo‘yicha",
      noProducts: "Mahsulotlar topilmadi",
      noProductsDesc: "Qidiruv parametrlarini o‘zgartirib ko‘ring",
    },
    productCard: {
      inStock: "Omborda bor",
      outOfStock: "Yetkazib berishda",
      minOrder: "Minimal buyurtma",
      addToCart: "Savatga",
      inCart: "Savatda",
      quickOrder: "Tezkor buyurtma",
      sum: "so‘m",
    },
    productDetail: {
      sku: "Artikul / SKU",
      brand: "Brend",
      category: "Kategoriya",
      unitPrice: "Birlik narxi",
      description: "Mahsulot tavsifi",
      characteristics: "Xususiyatlari",
      b2bNotice: "Yuridik shaxslar uchun to‘liq shartnoma, hisob-faktura va QQS bilan taqdim etiladi.",
      similarProducts: "O‘xshash mahsulotlar",
      quantity: "Miqdori",
      total: "Jami",
      backToCatalog: "Katalogga qaytish",
      deliveryInfo: "Yetkazib berish shartlari",
      paymentInfo: "To‘lov usullari",
    },
    cart: {
      title: "Savatcha",
      emptyTitle: "Savatchangiz bo‘sh",
      emptyDesc: "Katalogdan kerakli tovarlarni tanlab, savatchaga qo‘shing",
      toCatalog: "Katalogga o‘tish",
      itemsCount: "ta tovar",
      clearCart: "Savatchani tozalash",
      orderSummary: "Buyurtma hisobi",
      subtotal: "Mahsulotlar summasi",
      delivery: "Yetkazib berish",
      free: "Bepul",
      freeDeliveryNotice: "so‘mdan ortiq buyurtmalarga yetkazib berish bepul",
      total: "Jami to‘lov",
      checkout: "Zayavka yuborish",
      continueShopping: "Xaridni davom ettirish",
    },
    checkout: {
      title: "Buyurtmani rasmiylashtirish",
      contactInfo: "Buyurtmachi maʼlumotlari",
      fullName: "Ism / F.I.Sh.",
      fullNamePlaceholder: "Masalan: Jamshid Aliyev",
      phone: "Telefon raqami",
      company: "Kompaniya / Korxona nomi (ixtiyoriy)",
      companyPlaceholder: "Masalan: Golden Stroy MCHJ",
      inn: "INN (ixtiyoriy)",
      comment: "Izoh yoki yetkazish manzili",
      commentPlaceholder: "Manzil, qulay yetkazish vaqti yoki qo‘shimcha talablar...",
      b2bGuarantee: "Zayavka qabul qilingach, menejerimiz 15 daqiqa ichida siz bilan bog‘lanadi va hisob-faktura yuboradi.",
      submit: "Zayavkani tasdiqlash",
      submitting: "Yuborilmoqda...",
      successTitle: "Zayavka muvaffaqiyatli qabul qilindi!",
      successDesc: "Menejerimiz tez orada siz bilan bog‘lanadi va rasmiy hisob-faktura yuboradi.",
      orderNumber: "Zayavka raqami",
      backHome: "Bosh sahifaga qaytish",
    },
    footer: {
      aboutDesc: "Korxonalar, muassasalar va bizneslar uchun klining vositalari, maishiy kimyo va xo‘jalik mollari ulgurji ta’minoti.",
      catalogTitle: "Katalog bo‘limlari",
      companyTitle: "Kompaniya",
      aboutUs: "Biz haqimizda",
      deliveryPayment: "Yetkazib berish va to‘lov",
      contacts: "Bog‘lanish",
      adminLogin: "Admin kirish",
      rights: "Barcha huquqlar himoyalangan.",
      servicesTitle: "Xizmatlar",
      allCatalog: "Barcha mahsulotlar katalogi",
      leaveRequest: "Zayavka qoldirish",
      myRequests: "Mening zayavkalarim",
      ordersHistory: "Buyurtmalar tarixi",
      contactCenter: "Aloqa markazi",
      b2bContractEfactura: "Yagona shartnoma & E-faktura",
      availableProducts: "2,400+ turdagi B2B tovarlar mavjud",
    },
    mobileNav: {
      home: "Bosh",
      catalog: "Katalog",
      favorites: "Sevimli",
      cart: "Savat",
      requests: "Zayavkalar",
    },
    home: {
      showcaseTitle: "Biz kimlar uchun xizmat qilamiz",
      showcaseSubtitle: "Har bir soha uchun moslashtirilgan professional ta’minot to‘plamlari",
      popularProducts: "Ommabop mahsulotlar",
      newProducts: "Yangi kelgan tovarlar",
      viewAll: "Barchasini ko‘rish",
      ourPartners: "Bizning hamkorlarimiz",
      partnersSubtitle: "O‘zbekistonning yetakchi korxonalari biz bilan doimiy ishlaydi",
      b2bOffer: "Maxsus B2B Taklif • 20% Chegirma",
      allSupplies: "Korxonangiz Uchun Barcha Ta’minot",
      orderNow: "Buyurtma berish",
    },
    common: {
      loading: "Yuklanmoqda...",
      error: "Xatolik yuz berdi",
      save: "Saqlash",
      cancel: "Bekor qilish",
      delete: "O‘chirish",
      edit: "Tahrirlash",
      yes: "Ha",
      no: "Yo‘q",
    },
  },
  ru: {
    header: {
      deliveryRegion: "Доставка: По всему Узбекистану",
      contractGuarantee: "100% официальный договор, НДС и ЭСФ Didox",
      workHours: "Пн – Сб: 08:30 – 18:30",
      catalog: "Каталог",
      searchPlaceholder: "Поиск по названию, артикулу или бренду...",
      favorites: "Избранное",
      cart: "Корзина",
      quickRequest: "Быстрая заявка",
      ordersHistory: "Мои заказы",
      popularCategories: "Популярные разделы",
      allCategories: "Все категории",
      close: "Закрыть",
    },
    catalogPage: {
      title: "Каталог",
      allProducts: "Все товары",
      found: "товаров найдено",
      filters: "Фильтры",
      categories: "Категории",
      price: "Цена (сум)",
      inStockOnly: "Только в наличии",
      popularOnly: "Популярные товары",
      newOnly: "Новинки",
      resetFilters: "Сбросить фильтры",
      sortBy: "Сортировка",
      sortPopular: "По популярности",
      sortPriceAsc: "Сначала дешевые",
      sortPriceDesc: "Сначала дорогие",
      sortName: "По алфавиту",
      noProducts: "Товары не найдены",
      noProductsDesc: "Попробуйте изменить параметры поиска",
    },
    productCard: {
      inStock: "В наличии",
      outOfStock: "Под заказ",
      minOrder: "Мин. заказ",
      addToCart: "В корзину",
      inCart: "В корзине",
      quickOrder: "Быстрый заказ",
      sum: "сум",
    },
    productDetail: {
      sku: "Артикул / SKU",
      brand: "Бренд",
      category: "Категория",
      unitPrice: "Цена за единицу",
      description: "Описание товара",
      characteristics: "Характеристики",
      b2bNotice: "Для юридических лиц предоставляются полный договор, счет-фактура и НДС.",
      similarProducts: "Похожие товары",
      quantity: "Количество",
      total: "Итого",
      backToCatalog: "Вернуться в каталог",
      deliveryInfo: "Условия доставки",
      paymentInfo: "Способы оплаты",
    },
    cart: {
      title: "Корзина",
      emptyTitle: "Ваша корзина пуста",
      emptyDesc: "Выберите нужные товары из каталога и добавьте в корзину",
      toCatalog: "Перейти в каталог",
      itemsCount: "товаров",
      clearCart: "Очистить корзину",
      orderSummary: "Сумма заказа",
      subtotal: "Стоимость товаров",
      delivery: "Доставка",
      free: "Бесплатно",
      freeDeliveryNotice: "при заказе от сум доставка бесплатная",
      total: "Итого к оплате",
      checkout: "Оформить заявку",
      continueShopping: "Продолжить покупки",
    },
    checkout: {
      title: "Оформление заказа",
      contactInfo: "Контактные данные",
      fullName: "Имя / Ф.И.О.",
      fullNamePlaceholder: "Например: Алишер Усманов",
      phone: "Номер телефона",
      company: "Компания / Организация (необязательно)",
      companyPlaceholder: "Например: ООО Голден Строй",
      inn: "ИНН (необязательно)",
      comment: "Комментарий или адрес доставки",
      commentPlaceholder: "Адрес, удобное время доставки или дополнительные требования...",
      b2bGuarantee: "После отправки заявки наш менеджер свяжется с вами в течение 15 минут и выставит счет.",
      submit: "Подтвердить заявку",
      submitting: "Отправка...",
      successTitle: "Заявка успешно принята!",
      successDesc: "Номер заявки: #{id}. Наш менеджер скоро свяжется с вами и выставит официальный счет.",
      orderNumber: "Номер заявки",
      backHome: "На главную",
    },
    footer: {
      aboutDesc: "Оптовые комплексные поставки профессиональной химии, хозтоваров и средств гигиены для организаций и бизнеса.",
      catalogTitle: "Разделы каталога",
      companyTitle: "Компания",
      aboutUs: "О нас",
      deliveryPayment: "Доставка и оплата",
      contacts: "Контакты",
      adminLogin: "Вход для администратора",
      rights: "Все права защищены.",
      servicesTitle: "Услуги",
      allCatalog: "Полный каталог товаров",
      leaveRequest: "Оставить заявку",
      myRequests: "Мои заявки",
      ordersHistory: "История заказов",
      contactCenter: "Контакт-центр",
      b2bContractEfactura: "Единый договор & ЭСФ",
      availableProducts: "2,400+ видов B2B товаров в наличии",
    },
    mobileNav: {
      home: "Главная",
      catalog: "Каталог",
      favorites: "Избранное",
      cart: "Корзина",
      requests: "Заявки",
    },
    home: {
      showcaseTitle: "Для кого мы работаем",
      showcaseSubtitle: "Индивидуальные пакеты профессионального снабжения для каждой отрасли",
      popularProducts: "Популярные товары",
      newProducts: "Новые поступления",
      viewAll: "Смотреть все",
      ourPartners: "Наши партнеры",
      partnersSubtitle: "Ведущие предприятия Узбекистана выбирают надежное снабжение с нами",
      b2bOffer: "Специальное B2B предложение • Скидка 20%",
      allSupplies: "Все снабжение для вашего бизнеса",
      orderNow: "Оформить заказ",
    },
    common: {
      loading: "Загрузка...",
      error: "Произошла ошибка",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      yes: "Да",
      no: "Нет",
    },
  },
};

export const UNIT_TRANSLATIONS: Record<string, { uz: string; ru: string }> = {
  dona: { uz: 'dona', ru: 'шт.' },
  ta: { uz: 'dona', ru: 'шт.' },
  sht: { uz: 'dona', ru: 'шт.' },
  'шт': { uz: 'dona', ru: 'шт.' },
  'шт.': { uz: 'dona', ru: 'шт.' },
  'штука': { uz: 'dona', ru: 'шт.' },
  'штук': { uz: 'dona', ru: 'шт.' },
  'ед': { uz: 'dona', ru: 'ед.' },
  pachka: { uz: 'pachka', ru: 'пач.' },
  'пач': { uz: 'pachka', ru: 'пач.' },
  'пач.': { uz: 'pachka', ru: 'пач.' },
  'пачка': { uz: 'pachka', ru: 'пач.' },
  quti: { uz: 'quti', ru: 'кор.' },
  korobka: { uz: 'quti', ru: 'кор.' },
  'кор': { uz: 'quti', ru: 'кор.' },
  'кор.': { uz: 'quti', ru: 'кор.' },
  'коробка': { uz: 'quti', ru: 'кор.' },
  qadoq: { uz: 'qadoq', ru: 'упак.' },
  'упак': { uz: 'qadoq', ru: 'упак.' },
  'упак.': { uz: 'qadoq', ru: 'упак.' },
  'упаковка': { uz: 'qadoq', ru: 'упак.' },
  blok: { uz: 'blok', ru: 'блок' },
  'блок': { uz: 'blok', ru: 'блок' },
  rulon: { uz: 'rulon', ru: 'рул.' },
  'рул': { uz: 'rulon', ru: 'рул.' },
  'рул.': { uz: 'rulon', ru: 'рул.' },
  'рулон': { uz: 'rulon', ru: 'рул.' },
  juft: { uz: 'juft', ru: 'пар' },
  'пар': { uz: 'juft', ru: 'пар' },
  'пара': { uz: 'juft', ru: 'пар' },
  'пары': { uz: 'juft', ru: 'пар' },
  kanistra: { uz: 'kanistra', ru: 'канистра' },
  'канистра': { uz: 'kanistra', ru: 'канистра' },
  kg: { uz: 'kg', ru: 'кг' },
  'кг': { uz: 'kg', ru: 'кг' },
  litr: { uz: 'litr', ru: 'л' },
  l: { uz: 'litr', ru: 'л' },
  'л': { uz: 'litr', ru: 'л' },
  'литр': { uz: 'litr', ru: 'л' },
  toplam: { uz: "to'plam", ru: 'компл.' },
  'to‘plam': { uz: "to'plam", ru: 'компл.' },
  "to'plam": { uz: "to'plam", ru: 'компл.' },
  komplekt: { uz: 'komplekt', ru: 'компл.' },
  'компл': { uz: 'komplekt', ru: 'компл.' },
  'компл.': { uz: 'komplekt', ru: 'компл.' },
  'комплект': { uz: 'komplekt', ru: 'компл.' },
  metr: { uz: 'metr', ru: 'м' },
  m: { uz: 'metr', ru: 'м' },
  'м': { uz: 'metr', ru: 'м' },
};

export function formatUnit(unit?: string | null, language: Language = 'uz'): string {
  if (!unit || !unit.trim()) {
    return language === 'ru' ? 'шт.' : 'dona';
  }
  const clean = unit.trim().toLowerCase();
  const entry = UNIT_TRANSLATIONS[clean];
  if (entry) {
    return entry[language] || (language === 'ru' ? entry.ru : entry.uz);
  }
  return unit;
}

export const CATEGORY_FALLBACK_TRANSLATIONS: Record<string, { uz: string; ru: string }> = {
  avtokimyo: { uz: 'Avtokimyo', ru: 'Автохимия' },
  'maishiy-kimyo': { uz: 'Maishiy kimyo', ru: 'Бытовая химия' },
  gigiyena: { uz: 'Gigiyena', ru: 'Гигиена' },
  kanselyariya: { uz: 'Kanselyariya', ru: 'Канцелярия' },
  'himoya-vositalari': { uz: 'Himoya vositalari', ru: 'Средства защиты' },
  'tekstil-mahsulotlari': { uz: 'Tekstil mahsulotlari', ru: 'Текстиль' },
  tekstil: { uz: 'Tekstil', ru: 'Текстиль' },
  avtoximiya: { uz: 'Avtokimyo', ru: 'Автохимия' },
};

