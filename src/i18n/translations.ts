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
  favoritesPage: {
    title: string;
    subtitle: string;
    countUnit: string;
    emptyTitle: string;
    emptyDesc: string;
    viewCatalog: string;
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
  b2bInfoCards: {
    guarantee: string;
    b2bStandard: string;
    items: Array<{
      id: string;
      badge: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  aboutPage: {
    badge: string;
    title: string;
    description: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
    partnersTitle: string;
    partnersSubtitle: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  };
  deliveryPaymentPage: {
    badge: string;
    title: string;
    subtitle: string;
    deliveryTitle: string;
    deliverySubtitle: string;
    deliveryTimeTitle: string;
    deliveryTimeDesc: string;
    deliveryTashkentTitle: string;
    deliveryTashkentDescPre: string;
    deliveryTashkentDescPost: string;
    deliveryRegionsTitle: string;
    deliveryRegionsDesc: string;
    paymentTitle: string;
    paymentSubtitle: string;
    paymentTransferTitle: string;
    paymentTransferDesc: string;
    paymentCardTitle: string;
    paymentCardDesc: string;
    paymentCashTitle: string;
    paymentCashDesc: string;
    minOrderTitle: string;
    minOrderDesc: string;
    toCatalog: string;
  };
  contactsPage: {
    badge: string;
    title: string;
    subtitle: string;
    phones: string;
    telegram: string;
    telegramDesc: string;
    workHours: string;
    orders247: string;
    officeWarehouse: string;
    email: string;
    formTitle: string;
    formSubtitle: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sending: string;
    openMap: string;
    fillError: string;
    successToast: string;
    errorToast: string;
  };
  profilePage: {
    title: string;
    subtitle: string;
    b2bClient: string;
    requests: string;
    favorites: string;
    inCart: string;
    adminPanel: string;
    personalInfo: string;
    fullName: string;
    phone: string;
    company: string;
    inn: string;
    email: string;
    saveChanges: string;
    savedSuccess: string;
  };
  requestsHistoryPage: {
    title: string;
    b2bAccount: string;
    subtitle: string;
    newRequest: string;
    active: string;
    logout: string;
    requestNum: string;
    itemsCount: string;
    amount: string;
    sum: string;
    itemsList: string;
    contactPerson: string;
    company: string;
    comment: string;
    emptyTitle: string;
    emptyDesc: string;
    toCatalog: string;
    lookupTitle: string;
    lookupDesc: string;
    phoneLabel: string;
    lookupBtn: string;
    searching: string;
    securityGuaranteed: string;
    autoSaveNote: string;
    phoneError: string;
    statusApproved: string;
    statusDelivering: string;
    statusCompleted: string;
    statusCancelled: string;
    statusProcessing: string;
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
    favoritesPage: {
      title: "Sevimlilar",
      subtitle: "Siz saqlab qo‘ygan B2B mahsulotlar",
      countUnit: "ta",
      emptyTitle: "Hozircha sevimli mahsulotlar yo‘q",
      emptyDesc: "Katalogdan kerakli mahsulotlarni yurakcha belgisini bosib saqlab qo‘yishingiz mumkin.",
      viewCatalog: "Katalogni ko‘rish",
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
    b2bInfoCards: {
      guarantee: "100% Kafolat",
      b2bStandard: "B2B Standart",
      items: [
        {
          id: "delivery",
          badge: "Toshkent bo‘ylab",
          title: "Bepul yetkazib berish",
          description: "500 000 so‘mdan yuqori har qanday zayavka to‘g‘ridan-to‘g‘ri ofisingizgacha bepul va tez yetkazib beriladi.",
          icon: "Truck",
        },
        {
          id: "supply",
          badge: "Barcha mahsulotlar bir joyda",
          title: "Kompleks ta’minot",
          description: "Ofisdan tortib ishlab chiqarishgacha kerak bo‘ladigan 1000 dan ortiq mahsulotlarni yagona shartnoma bilan ta’minlaymiz.",
          icon: "Boxes",
        },
        {
          id: "payment",
          badge: "Yuridik va jismoniy shaxslar uchun",
          title: "Har qanday to‘lov usuli",
          description: "Pul o‘tkazish (Перечисление), naqd hisob, korporativ karta, Click va Payme tizimlari orqali qulay to‘lov.",
          icon: "CreditCard",
        },
        {
          id: "detergents",
          badge: "Keng professional assortiment",
          title: "Yuvish vositalari",
          description: "Sertifikatlangan, SanPiN talablariga to‘liq javob beruvchi professional va maishiy kimyo mahsulotlari ombori.",
          icon: "Sparkles",
        },
      ],
    },
    aboutPage: {
      badge: "SNABTASH B2B Ta’minot",
      title: "Korxonalar va tashkilotlar uchun ishonchli ta’minot hamkori",
      description: "Biz O‘zbekistondagi yuzlab kompaniyalar, ofislar, restoranlar, fabrikalar va klinikalarga sifatli tozalash, gigiyena, kanselyariya va xo‘jalik mahsulotlarini uzluksiz yetkazib beramiz.",
      pillar1Title: "Yagona ta’minotchi",
      pillar1Desc: "Barcha xo‘jalik va kimyoviy ehtiyojlarni 10 xil do‘kondan emas, aynan bitta joydan, yagona hisob-faktura bilan xarid qiling.",
      pillar2Title: "Tezkor logistika",
      pillar2Desc: "O‘zimizning avtoparkimiz va tajribali haydovchilarimiz orqali Toshkent bo‘ylab buyurtmalarni ertasi kuniyoq yetkazib beramiz.",
      pillar3Title: "100% Sertifikatlangan",
      pillar3Desc: "Barcha professional kimyo va gigiyena vositalari gigiyenik va sifat sertifikatlariga ega.",
      pillar4Title: "Qulay B2B narxlar",
      pillar4Desc: "To‘g‘ridan-to‘g‘ri ishlab chiqaruvchilardan olib kelinganligi sababli bozor narxlaridan arzon va ulgurji tariflar.",
      partnersTitle: "Bizga ishonch bildirgan brendlar",
      partnersSubtitle: "Yirik ishlab chiqaruvchilar, korporatsiyalar va xalqaro brendlar bilan uzoq muddatli shartnomalar asosida ishlaymiz.",
      ctaTitle: "Hamkorlik qilishga tayyormisiz?",
      ctaDesc: "Kompaniyangiz ehtiyojlari uchun eng maqbul narxlar va qulay yetkazib berish jadvalini tuzib beramiz.",
      ctaBtn: "Korporativ zayavka qoldirish",
    },
    deliveryPaymentPage: {
      badge: "Shartlar va qoidalar",
      title: "To‘lov va Yetkazib berish",
      subtitle: "Yuridik va jismoniy shaxslar uchun eng qulay hisob-kitob hamda logistika shartlari",
      deliveryTitle: "Yetkazib berish shartlari",
      deliverySubtitle: "Tezkor va aniq rejalashtirilgan logistika",
      deliveryTimeTitle: "Yetkazib berish vaqti:",
      deliveryTimeDesc: "Soat 16:00 ga qadar tasdiqlangan zayavkalar ertasi kuniyoq (24 soat ichida) to‘g‘ridan-to‘g‘ri ofisingiz yoki omboringiz eshigigacha yetkaziladi.",
      deliveryTashkentTitle: "Toshkent shahri bo‘ylab:",
      deliveryTashkentDescPre: "Minimal",
      deliveryTashkentDescPost: "miqdoridagi B2B buyurtmalarda yetkazib berish mutlaqo bepul.",
      deliveryRegionsTitle: "Viloyatlarga yetkazish:",
      deliveryRegionsDesc: "Toshkent viloyati va O‘zbekistonning barcha viloyatlariga kuryerlik yoki transport kompaniyalari (BTS, Fargo) orqali yetkazib beriladi.",
      paymentTitle: "B2B To‘lov usullari",
      paymentSubtitle: "To‘liq qonuniy va shaffof hisob-kitob",
      paymentTransferTitle: "Pul o‘tkazish (Bank hisob-raqami / Перечисление):",
      paymentTransferDesc: "Yuridik shaxslar uchun shartnoma, hisob-kitob varaqasi (schet-faktura) va elektron hujjat aylanishi (Didox, Soliq) orqali E-Faktura.",
      paymentCardTitle: "Korporativ karta va terminal:",
      paymentCardDesc: "Korxona korporativ kartasi (Uzcard / Humo) orqali to‘lov qilish imkoniyati.",
      paymentCashTitle: "Naqd pul / Elektron to‘lovlar:",
      paymentCashDesc: "Kassa cheki bilan naqd pul yoki Click, Payme ilovalari orqali to‘lov.",
      minOrderTitle: "Minimal zayavka miqdori: 500 000 so‘m",
      minOrderDesc: "Saytda zayavka shakllantirilgandan so‘ng, yakuniy narx va yetkazib berish korporativ menejer bilan kelishiladi.",
      toCatalog: "Katalogga o‘tish",
    },
    contactsPage: {
      badge: "Aloqa va manzil",
      title: "Biz bilan bog‘laning",
      subtitle: "B2B ta’minot, mahsulotlar mavjudligi va maxsus shartnomalar bo‘yicha savollaringiz bormi?",
      phones: "Telefonlar",
      telegram: "Telegram Menejer",
      telegramDesc: "Tezkor savol-javob va narxlar",
      workHours: "Ish vaqti",
      orders247: "Buyurtmalar 24/7 qabul qilinadi",
      officeWarehouse: "Bosh ofis & Ombor",
      email: "Elektron pochta",
      formTitle: "Murojaat yoki savol qoldirish",
      formSubtitle: "Bizga xabar qoldiring, korporativ mutaxassisimiz siz bilan qisqa vaqt ichida bog‘lanadi.",
      successTitle: "Rahmat! Xabaringiz yuborildi",
      successDesc: "Mutaxassisimiz ko‘rsatilgan raqamga qo‘ng‘iroq qiladi yoki Telegram orqali javob beradi.",
      sendAnother: "Yana xabar yuborish",
      nameLabel: "Ismingiz",
      namePlaceholder: "Ismingizni kiriting",
      phoneLabel: "Telefon raqamingiz",
      messageLabel: "Xabaringiz yoki savolingiz",
      messagePlaceholder: "Qanday mahsulotlar yoki shartnomalar haqida ma’lumot olmoqchisiz?...",
      sendBtn: "Xabarni yuborish",
      sending: "Yuborilmoqda...",
      openMap: "Xaritada ochish ↗",
      fillError: "Ism va telefon raqamni to‘liq kiriting",
      successToast: "Xabaringiz qabul qilindi! Menejerimiz tez orada bog‘lanadi.",
      errorToast: "Xabar yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.",
    },
    profilePage: {
      title: "Profil va B2B ma’lumotlar",
      subtitle: "Kompaniyangiz rekvizitlari va zayavkalar tarixi",
      b2bClient: "B2B Mijoz",
      requests: "Zayavka",
      favorites: "Sevimli",
      inCart: "Savatda",
      adminPanel: "Admin Boshqaruv Paneli",
      personalInfo: "Shaxsiy va korporativ ma’lumotlar",
      fullName: "Ism va Familiya",
      phone: "Telefon raqam",
      company: "Kompaniya nomi",
      inn: "STIR / INN",
      email: "Elektron pochta (Email)",
      saveChanges: "O‘zgarishlarni saqlash",
      savedSuccess: "Profil ma’lumotlari muvaffaqiyatli saqlandi!",
    },
    requestsHistoryPage: {
      title: "Mening zayavkalarim",
      b2bAccount: "B2B Hisob",
      subtitle: "Yuborilgan barcha B2B ta’minot zayavkalari va ularning holati",
      newRequest: "Yangi zayavka",
      active: "Faol",
      logout: "Chiqish",
      requestNum: "Zayavka",
      itemsCount: "ta mahsulot birligi",
      amount: "Summa:",
      sum: "so‘m",
      itemsList: "Zayavka tarkibi:",
      contactPerson: "Aloqa qiluvchi shaxs:",
      company: "Kompaniya:",
      comment: "Izoh:",
      emptyTitle: "Hozircha zayavkalar yo‘q",
      emptyDesc: "Ushbu telefon raqamiga biriktirilgan zayavkalar hali mavjud emas. Katalogdan tovarlarni tanlab, birinchi zayavkani yuboring.",
      toCatalog: "Katalogga o‘tish",
      lookupTitle: "Zayavkalaringizni ko‘rish",
      lookupDesc: "Kompaniyangiz yuborgan zayavkalar va buyurtma holatini ko‘rish uchun telefon raqamingizni kiriting. Murakkab parol kerak emas.",
      phoneLabel: "Telefon raqamingiz",
      lookupBtn: "Zayavkalarni ko‘rish",
      searching: "Qidirilmoqda...",
      securityGuaranteed: "Ma’lumotlar xavfsizligi kafolatlangan",
      autoSaveNote: "Birinchi marta zayavka berayotgan bo‘lsangiz, buyurtma yuborishingiz bilan hisobingiz avtomatik saqlanadi.",
      phoneError: "Telefon raqamingizni to‘liq kiriting (+998 __ ___ __ __)",
      statusApproved: "Tasdiqlangan",
      statusDelivering: "Yetkazilmoqda",
      statusCompleted: "Bajarildi",
      statusCancelled: "Bekor qilindi",
      statusProcessing: "Kutilmoqda",
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
    favoritesPage: {
      title: "Избранное",
      subtitle: "Сохраненные вами B2B товары",
      countUnit: "шт.",
      emptyTitle: "В избранном пока нет товаров",
      emptyDesc: "Вы можете сохранить нужные товары из каталога, нажав на значок сердечка.",
      viewCatalog: "Перейти в каталог",
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
    b2bInfoCards: {
      guarantee: "100% Гарантия",
      b2bStandard: "B2B Стандарт",
      items: [
        {
          id: "delivery",
          badge: "По Ташкенту",
          title: "Бесплатная доставка",
          description: "Любая B2B заявка от 500 000 сум доставляется оперативно и бесплатно прямо до вашего офиса или склада.",
          icon: "Truck",
        },
        {
          id: "supply",
          badge: "Все товары в одном месте",
          title: "Комплексное снабжение",
          description: "Обеспечиваем более 1 000 наименований товаров от офиса до производства по единому договору.",
          icon: "Boxes",
        },
        {
          id: "payment",
          badge: "Для юридических и физлиц",
          title: "Любые способы оплаты",
          description: "Оплата перечислением (с НДС и ЭСФ), корпоративной картой, наличными, а также через Click и Payme.",
          icon: "CreditCard",
        },
        {
          id: "detergents",
          badge: "Широкий ассортимент",
          title: "Моющие средства",
          description: "Склад сертифицированной профессиональной и бытовой химии, полностью отвечающей нормам СанПиН.",
          icon: "Sparkles",
        },
      ],
    },
    aboutPage: {
      badge: "SNABTASH B2B Снабжение",
      title: "Надежный партнер по комплексному снабжению для предприятий",
      description: "Мы обеспечиваем бесперебойные поставки качественных моющих средств, гигиены, канцелярии и хозяйственных товаров для сотен компаний, офисов, ресторанов, заводов и клиник Узбекистана.",
      pillar1Title: "Единый поставщик",
      pillar1Desc: "Приобретайте все хозяйственные и химические товары в одном месте по единому счет-фактуре, не распыляясь на десятки разных продавцов.",
      pillar2Title: "Оперативная логистика",
      pillar2Desc: "Собственный автопарк и опытные экспедиторы позволяют доставлять заказы по Ташкенту уже на следующий рабочий день.",
      pillar3Title: "100% Сертифицировано",
      pillar3Desc: "Вся профессиональная химия и средства личной гигиены имеют сертификаты качества и санитарно-эпидемиологические заключения.",
      pillar4Title: "Выгодные B2B цены",
      pillar4Desc: "Прямые оптовые поставки от заводов-производителей гарантируют цены существенно ниже розничного рынка.",
      partnersTitle: "Бренды, которые нам доверяют",
      partnersSubtitle: "Мы работаем на основе долгосрочных контрактов с ведущими производителями, корпорациями и международными брендами.",
      ctaTitle: "Готовы к долгосрочному партнерству?",
      ctaDesc: "Мы сформируем выгодное коммерческое предложение и настроим регулярный график снабжения для вашей компании.",
      ctaBtn: "Оставить корпоративную заявку",
    },
    deliveryPaymentPage: {
      badge: "Условия и правила",
      title: "Доставка и Оплата",
      subtitle: "Удобные условия взаиморасчетов и прозрачной логистики для юридических и физических лиц",
      deliveryTitle: "Условия доставки",
      deliverySubtitle: "Быстрая и надежная корпоративная логистика",
      deliveryTimeTitle: "Сроки доставки:",
      deliveryTimeDesc: "Заявки, утвержденные до 16:00, доставляются на следующий день (в течение 24 часов) прямо до дверей офиса или склада.",
      deliveryTashkentTitle: "По городу Ташкент:",
      deliveryTashkentDescPre: "При заказе на сумму от",
      deliveryTashkentDescPost: "доставка B2B заказов осуществляется абсолютно бесплатно.",
      deliveryRegionsTitle: "Доставка в регионы:",
      deliveryRegionsDesc: "В Ташкентскую область и все регионы Республики Узбекистан доставка осуществляется курьерскими и транспортными службами (BTS, Fargo и др.).",
      paymentTitle: "Способы B2B оплаты",
      paymentSubtitle: "Официальный и прозрачный документооборот",
      paymentTransferTitle: "Безналичный расчет (Перечисление / расчетный счет):",
      paymentTransferDesc: "Для юридических лиц: официальный договор, счет на оплату, работа через системы электронных счетов-фактур (Didox, Soliq).",
      paymentCardTitle: "Корпоративная карта и терминал:",
      paymentCardDesc: "Возможность оперативной оплаты корпоративными картами предприятий (Uzcard / Humo).",
      paymentCashTitle: "Наличный расчет / Электронные платежи:",
      paymentCashDesc: "Оплата наличными с выдачей кассового чека либо через платежные системы Click и Payme.",
      minOrderTitle: "Минимальная сумма заявки: 500 000 сум",
      minOrderDesc: "После оформления заявки на сайте персональный корпоративный менеджер свяжется для уточнения цен и деталей доставки.",
      toCatalog: "Перейти в каталог",
    },
    contactsPage: {
      badge: "Контакты и адрес",
      title: "Свяжитесь с нами",
      subtitle: "Есть вопросы по B2B поставкам, наличию товаров или заключению договоров?",
      phones: "Телефоны",
      telegram: "Telegram Менеджер",
      telegramDesc: "Быстрые ответы и консультации по ценам",
      workHours: "Режим работы",
      orders247: "Заявки на сайте принимаются 24/7",
      officeWarehouse: "Главный офис и Склад",
      email: "Электронная почта",
      formTitle: "Оставить обращение или вопрос",
      formSubtitle: "Оставьте сообщение, наш корпоративный специалист свяжется с вами в течение короткого времени.",
      successTitle: "Спасибо! Ваше сообщение принято",
      successDesc: "Наш менеджер перезвонит по указанному номеру или свяжется в Telegram.",
      sendAnother: "Отправить еще сообщение",
      nameLabel: "Ваше имя",
      namePlaceholder: "Введите ваше имя",
      phoneLabel: "Номер телефона",
      messageLabel: "Ваше сообщение или вопрос",
      messagePlaceholder: "О каких товарах или условиях сотрудничества вы хотите узнать?...",
      sendBtn: "Отправить сообщение",
      sending: "Отправка...",
      openMap: "Открыть на карте ↗",
      fillError: "Пожалуйста, заполните имя и номер телефона",
      successToast: "Ваше обращение принято! Менеджер свяжется с вами в ближайшее время.",
      errorToast: "Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.",
    },
    profilePage: {
      title: "Профиль и данные B2B",
      subtitle: "Реквизиты вашей компании и история заявок",
      b2bClient: "B2B Клиент",
      requests: "Заявки",
      favorites: "Избранное",
      inCart: "В корзине",
      adminPanel: "Панель администратора",
      personalInfo: "Личные и корпоративные данные",
      fullName: "Имя и Фамилия",
      phone: "Номер телефона",
      company: "Название компании",
      inn: "ИНН организации",
      email: "Электронная почта (Email)",
      saveChanges: "Сохранить изменения",
      savedSuccess: "Данные профиля успешно сохранены!",
    },
    requestsHistoryPage: {
      title: "Мои заявки",
      b2bAccount: "B2B Аккаунт",
      subtitle: "Все отправленные B2B заявки на снабжение и их актуальный статус",
      newRequest: "Новая заявка",
      active: "Активен",
      logout: "Выйти",
      requestNum: "Заявка",
      itemsCount: "ед. товаров",
      amount: "Сумма:",
      sum: "сум",
      itemsList: "Состав заявки:",
      contactPerson: "Контактное лицо:",
      company: "Компания:",
      comment: "Комментарий:",
      emptyTitle: "Заявок пока нет",
      emptyDesc: "К этому номеру телефона пока не привязано ни одной заявки. Выберите товары в каталоге и отправьте первую заявку.",
      toCatalog: "Перейти в каталог",
      lookupTitle: "Просмотр ваших заявок",
      lookupDesc: "Введите номер телефона, чтобы увидеть историю и статус заявок вашей организации. Пароль не требуется.",
      phoneLabel: "Номер телефона",
      lookupBtn: "Показать заявки",
      searching: "Поиск заявок...",
      securityGuaranteed: "Безопасность данных гарантирована",
      autoSaveNote: "При первом оформлении заявки аккаунт сохраняется автоматически.",
      phoneError: "Введите номер телефона полностью (+998 __ ___ __ __)",
      statusApproved: "Подтвержден",
      statusDelivering: "В пути",
      statusCompleted: "Выполнен",
      statusCancelled: "Отменен",
      statusProcessing: "В обработке",
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

