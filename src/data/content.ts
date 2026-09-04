import { BannerSlide, Industry, Partner, BundlePackage, Testimonial } from '../types';

export interface HeroSlideItem {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export const HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 1,
    title: 'Korxonalar uchun kompleks ta’minot',
    description: 'Bir joyda barcha kerakli xo‘jalik, gigiyena va himoya mahsulotlari. Ishingiz uchun qulay, biz bilan ishonchli!',
    ctaText: 'Katalogni ko‘rish',
    ctaLink: '/catalog',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 2,
    title: 'Individual himoya vositalari va ishchi qo‘lqoplar',
    description: 'Trikotaj paxta, lateks, nitril va issiq qoplamali qo‘lqoplar to‘g‘ridan-to‘g‘ri ishlab chiqaruvchi narxlarida.',
    ctaText: 'Himoya vositalari',
    ctaLink: '/catalog/himoya-vositalari',
    imageUrl: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 3,
    title: 'Professional maishiy kimyo va klining vositalari',
    description: 'Grass, Vanish, Fairy va maxsus tozalovchi vositalar bilan korxonangiz tozaligini kafolatlang.',
    ctaText: 'Kimyo vositalari',
    ctaLink: '/catalog/maishiy-kimyo',
    imageUrl: 'https://images.unsplash.com/photo-1585670270608-b404fb88dd21?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 4,
    title: 'Toshkent bo‘ylab tez va bepul yetkazib berish',
    description: '500 000 so‘mdan yuqori B2B zayavkalarni ertasi kuniyoq ofisingiz yoki omboringizgacha yetkazamiz.',
    ctaText: 'Zayavka qoldirish',
    ctaLink: '/request',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&auto=format&fit=crop&q=85',
  },
];

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    title: 'Toshkent bo‘ylab bepul yetkazib berish',
    subtitle: '500 000 so‘mdan yuqori bo‘lgan barcha B2B zayavkalaringizni ertasi kuniyoq to‘g‘ridan-to‘g‘ri ofisingiz yoki omboringizgacha yetkazib beramiz.',
    ctaText: 'Katalogni ko‘rish',
    ctaLink: '/catalog',
    tag: 'Toshkent bo‘ylab',
    badge: '0 so‘m yetkazib berish',
    bullets: ['Ertasi kuniyoq yetkazish', 'Eshikkacha bepul kuryer', 'Toshkent shahri bo‘yicha'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Korxonalar uchun kompleks ta’minot',
    subtitle: 'Biz sizning biznesingizga kerakli barcha mahsulotlarni bir joyda jamlaymiz va vaqtingizni hamda byudjetingizni sezilarli darajada tejaymiz.',
    ctaText: 'Katalogni ko‘rish',
    ctaLink: '/catalog',
    tag: 'B2B Kompleks',
    badge: '1000+ Mahsulotlar',
    bullets: ['Yagona hisob-faktura', 'Shaxsiy korporativ menejer', 'Kafolatlangan sifat'],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Istalgan to‘lov usullari',
    subtitle: 'Yuridik va jismoniy shaxslar uchun to‘lovning barcha qulay turlari: shartnoma asosida pul o‘tkazish, korporativ karta, hisob-kitob, Click va Payme.',
    ctaText: 'To‘lov shartlari',
    ctaLink: '/delivery-payment',
    tag: 'Qulay hisob-kitob',
    badge: 'B2B Shartnoma',
    bullets: ['Перечисление (Pul o‘tkazish)', 'Naqd hisob-kitob', 'Korporativ karta', 'Click & Payme'],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Keng yuvish vositalari assortimenti',
    subtitle: 'Professional klining, oshxona, ishlab chiqarish va sanuzellar uchun sertifikatlangan kimyoviy tozalash vositalarining ulgurji ombori.',
    ctaText: 'Mahsulotlarni ko‘rish',
    ctaLink: '/catalog/maishiy-kimyo',
    tag: 'Professional Kimyo',
    badge: 'Ulgurji narxlar',
    bullets: ['Sertifikatlangan vositalar', 'Katta hajm 5L - 20L', 'SanPiN talablariga mos'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000&auto=format&fit=crop&q=80',
  },
];

export const INDUSTRIES: Industry[] = [
  {
    id: 'ofislar',
    title: 'Ofislar',
    description: 'Ofis uchun zarur kundalik sarflov mahsulotlari, qog‘oz, gigiyena va kantselyariya.',
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    slug: 'kanselyariya',
  },
  {
    id: 'restoran-mehmonxona',
    title: 'Restoran va mehmonxonalar',
    description: 'HoReCa yo‘nalishi uchun professional idish yuvish, tozalash va gigiyena buyumlari.',
    icon: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    slug: 'maishiy-kimyo',
  },
  {
    id: 'klining',
    title: 'Klining kompaniyalari',
    description: 'Professional yuvish vositalari, konsentratlar, mikrofibralar va maxsus uskunalar.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    slug: 'maishiy-kimyo',
  },
  {
    id: 'zavod-fabrika',
    title: 'Zavod va fabrikalar',
    description: 'Katta hajmdagi texnik kimyo vositalari, individual himoya vositalari va dezinfeksiya.',
    icon: 'Factory',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    slug: 'himoya-vositalari',
  },
  {
    id: 'avtosalon-avtoservis',
    title: 'Avtosalon va avtoservislar',
    description: 'Avtokimyo, kontaktsiz avtoshampunlar, oynayuvgichlar, moyka va ustaxona vositalari.',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    slug: 'avtokimyo',
  },
  {
    id: 'oquv-markazlari',
    title: 'O‘quv markazlari',
    description: 'A4 qog‘ozlar, doska markerlari, yozuv qurollari va gigiyenik sarflov materiallari.',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    slug: 'kanselyariya',
  },
  {
    id: 'shifoxona-klinikalar',
    title: 'Shifoxona va klinikalar',
    description: 'Tibbiy dezinfeksiya, spirtli antiseptiklar, nitril qo‘lqoplar va dispenser qog‘ozlari.',
    icon: 'Hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    slug: 'gigiyena',
  },
];

export const PARTNERS: Partner[] = [
  { id: '1', name: 'BETOMAX', logo: 'BETOMAX', category: 'Beton & Qurilish' },
  { id: '2', name: 'BINOKOR', logo: 'BINOKOR', category: 'Temir-beton majmuasi' },
  { id: '3', name: 'AGROMIR', logo: 'AGROMIR', category: 'Agro holding' },
  { id: '4', name: 'Beta Plus', logo: 'Beta Plus', category: 'Ishlab chiqarish' },
  { id: '5', name: 'UZTELECOM', logo: 'UZTELECOM', category: 'Telekom' },
  { id: '6', name: 'Artel Electronics', logo: 'Artel', category: 'Maishiy texnika' },
];

export const B2B_INFO_CARDS = [
  {
    id: 'delivery',
    title: 'Bepul yetkazib berish',
    subtitle: 'Toshkent bo‘ylab',
    description: '500 000 so‘mdan yuqori har qanday zayavka to‘g‘ridan-to‘g‘ri ofisingizgacha bepul va tez yetkazib beriladi.',
    icon: 'Truck',
  },
  {
    id: 'supply',
    title: 'Kompleks ta’minot',
    subtitle: 'Barcha mahsulotlar bir joyda',
    description: 'Ofisdan tortib ishlab chiqarishgacha kerak bo‘ladigan 1000 dan ortiq mahsulotlarni yagona shartnoma bilan ta’minlaymiz.',
    icon: 'Boxes',
  },
  {
    id: 'payment',
    title: 'Har qanday to‘lov usuli',
    subtitle: 'Yuridik va jismoniy shaxslar uchun',
    description: 'Pul o‘tkazish (Перечисление), naqd hisob, korporativ karta, Click va Payme tizimlari orqali qulay to‘lov.',
    icon: 'CreditCard',
  },
  {
    id: 'detergents',
    title: 'Yuvish vositalari',
    subtitle: 'Keng professional assortiment',
    description: 'Sertifikatlangan, SanPiN talablariga to‘liq javob beruvchi professional va maishiy kimyo mahsulotlari ombori.',
    icon: 'Sparkles',
  },
];

export const CONTACT_INFO = {
  phones: ['+998 87 034 97 79', '+998 87 382 97 79'],
  telegram: '@snabtash',
  workHours: '09:00–17:00',
  workDays: 'Dushanba – Juma',
  address: 'Toshkent shahri, Sergeli tumani, Tashkent Index, A3-blok',
  email: 'info@snabtash.uz',
  inn: '309876543',
  bank: 'ATB "Kapitalbank" Toshkent sh.',
};

export const BUNDLE_PACKAGES: BundlePackage[] = [
  {
    id: 'bundle-office-comfort',
    slug: 'ofis-gigiyena-paketi',
    title: 'Ofis Gigiyena Paketi',
    subtitle: '50 kishilik ofis uchun oylik to‘liq gigiyena to‘plami',
    itemsList: 'Suyuq sovun 5L, Tellux Z2 sochiq (5 qadoq), Salfetki Elma, Tualet qog‘ozi (12 dona)',
    itemsCount: 4,
    price: 185000,
    oldPrice: 220000,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    tag: 'Eng ommabop',
    description: 'Ofis xodimlari va sanuzellari uchun 1 oylik barcha zarur gigiyena vositalarini o‘z ichiga olgan tejamkor kompleks paket.',
  },
  {
    id: 'bundle-cleaning-pro',
    slug: 'klining-professional-paketi',
    title: 'Klining Pro To‘plami',
    subtitle: 'Professional tozalash va parvarishlash to‘plami',
    itemsList: 'Grass zanglamas po‘lat tozalagich, Vanish Oxi 500ml, Grass Dos 3in1, Qopqoqli chelak 10L',
    itemsCount: 4,
    price: 215000,
    oldPrice: 260000,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80',
    tag: 'Klining tanlovi',
    description: 'Biznes markazlar va xususiy obyektlarni mukammal tozalash uchun Grass va Vanish brendlarining eng samarali vositalari.',
  },
  {
    id: 'bundle-warehouse-safety',
    slug: 'ombor-himoya-paketi',
    title: 'Ombor Himoya Paketi',
    subtitle: 'Ishchilar va ombor xodimlari uchun 100 juft qo‘lqoplar',
    itemsList: 'Sintetik apelsin qo‘lqoplar (20 juft), Zebra lateks (20 juft), 45g paxta qo‘lqoplari (60 juft)',
    itemsCount: 3,
    price: 245000,
    oldPrice: 290000,
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80',
    tag: 'Zavod & Ombor',
    description: 'Ishlab chiqarish va yuk ortish-tushirish jarayonida qo‘llarning to‘liq xavfsizligini ta’minlovchi mustahkam to‘plam.',
  },
  {
    id: 'bundle-horeca-express',
    slug: 'horeca-oshxona-paketi',
    title: 'HoReCa Oshxona Paketi',
    subtitle: 'Restoran, kafe va oshxonalar uchun oylik to‘plam',
    itemsList: 'Elma 33x33 salfetka (10 pachka), Nitril ko‘k qo‘lqop (1 quti), Chiqindi paketi 60L (5 rulon)',
    itemsCount: 3,
    price: 195000,
    oldPrice: 235000,
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
    tag: 'Restoran & Kafe',
    description: 'Umumiy ovqatlanish korxonalari uchun SanPiN talablariga mos yuqori sifatli sarflov materiallari.',
  },
  {
    id: 'bundle-stationery-starter',
    slug: 'ofis-kanselyariya-paketi',
    title: 'Ofis Boshlang‘ich Paketi',
    subtitle: 'Buxgalteriya va ma’muriyat uchun kantselyariya',
    itemsList: 'SvetoCopy A4 qog‘oz (5 pachka), Chiqindi xaltalari 60L, Glade aerozol 300ml',
    itemsCount: 3,
    price: 275000,
    oldPrice: 320000,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80',
    tag: 'Kanselyariya',
    description: 'Har bir ofisga har oy zarur bo‘ladigan yuqori sifatli bosma qog‘oz va qulay xo‘jalik mahsulotlari.',
  },
  {
    id: 'bundle-auto-wash',
    slug: 'avtokimyo-texnik-paketi',
    title: 'Avtoservis & Texnik To‘plam',
    subtitle: 'Avtosalonlar va ustaxonalar uchun maxsus kimyo',
    itemsList: 'Grass Polyrole mat jilolagich, Grass Antigraffiti 600ml, Nitril moyga chidamli qo‘lqop',
    itemsCount: 3,
    price: 230000,
    oldPrice: 275000,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80',
    tag: 'Avto & Detayling',
    description: 'Avtomobillarni tozalash, plastik sirtlarni jilolash va texnik kimyoviy ishlov berish to‘plami.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alisher Qodirov',
    role: 'Bosh ta’minot menejeri',
    company: 'Artel Electronics MChJ',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'SNABTASH bilan 2 yildan beri hamkorlik qilamiz. Ishchi qo‘lqoplar va maishiy kimyolarni doim o‘z vaqtida, e-faktura va barcha sertifikatlari bilan yetkazib berishadi. Xizmat darajasi a’lo!',
  },
  {
    id: 'test-2',
    name: 'Dilnoza Karimova',
    role: 'Xo‘jalik bo‘limi rahbari',
    company: 'Murad Buildings',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Ofislarimiz va savdo markazlarimiz uchun gigiyena vositalarini to‘liq to‘plam qilib buyurtma beramiz. Bitta hisob-faktura orqali barcha filiallarimizga bepul yetkazib berilishi bizga juda katta qulaylik yaratdi.',
  },
  {
    id: 'test-3',
    name: 'Jamshid Rustamov',
    role: 'Operatsion direktor',
    company: 'Safia Bakery & Cafe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Oshxona va qandolatchilik filiallarimiz uchun Tellux sochiqlar, Elma salfetkalar va Grass mahsulotlarini faqat SNABTASH’dan olamiz. Narxlar ulgurji va sifat doim bir xil barqaror.',
  },
];
