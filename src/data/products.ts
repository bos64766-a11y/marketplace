import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // --- 1. INDIVIDUAL HIMOYA VOSITALARI (PPE) ---
  {
    id: 'snb-gloves-orange',
    slug: 'sintetik-apelsin-qolqoplar',
    name: 'Sintetik apelsin qo‘lqoplar',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'SafeWork',
    sku: 'GLV-ORG-01',
    rating: 4.9,
    reviewsCount: 142,
    price: 7728,
    isPopular: true,
    isNew: false,
    tag: 'Sintetik',
    inStock: true,
    stockCount: 1500,
    images: [
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Yorqin apelsin rangli sintetik ishchi qo‘lqoplar. Sirpanishga qarshi qoplama, yuqori chidamlilik va elastiklikka ega.',
    specifications: {
      'Turi': 'Sintetik ishchi qo‘lqop',
      'Rangi': 'Apelsin / Qora manjet',
      'Qo‘llanishi': 'Ombor, montaj va qurilish ishlari',
      'Qadoqda': '12 juft / 120 juft'
    },
    unit: 'juft',
    minOrder: 10
  },
  {
    id: 'snb-gloves-insulated-300',
    slug: 'issiq-qoplamali-qolqoplar-300',
    name: 'Issiq qoplamali qo‘lqoplar 300',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'ThermoGrip',
    sku: 'GLV-THM-300',
    rating: 4.8,
    reviewsCount: 88,
    price: 6944,
    isPopular: true,
    isNew: false,
    tag: 'Uteplenny',
    inStock: true,
    stockCount: 950,
    images: [
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Sovuq sharoitda va sovuq xonalarda ishlash uchun mo‘ljallangan issiq qoplamali to‘liq himoya qo‘lqoplari.',
    specifications: {
      'Turi': 'Issiq lateks qoplamali',
      'Model': '300 Series',
      'Xususiyati': 'Sovuqqa chidamli yumshoq astar'
    },
    unit: 'juft',
    minOrder: 10
  },
  {
    id: 'snb-gloves-latex-zebra',
    slug: 'lateks-qoplamali-zebra-qolqoplar',
    name: 'Lateks qoplamali Zebra qo‘lqoplar',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'ZebraPro',
    sku: 'GLV-LTX-ZBR',
    rating: 4.7,
    reviewsCount: 65,
    price: 4144,
    isPopular: true,
    isNew: false,
    tag: 'Zebra',
    inStock: true,
    stockCount: 2200,
    images: [
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Ko‘k rangli chidamli lateks qoplamali Zebra modeli. Quruq va nam yuzalarda buyumlarni mustahkam ushlaydi.',
    specifications: {
      'Material': 'Trikotaj + Ko‘k lateks qoplama',
      'Chidamlilik': 'Ayniqsa nam sharoitda yuqori ushlab turish'
    },
    unit: 'juft',
    minOrder: 10
  },
  {
    id: 'snb-gloves-latex-korea',
    slug: 'lateks-qoplamali-koreya-qolqoplar',
    name: 'Lateks qoplamali Koreya qo‘lqoplar',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'KoreaTech',
    sku: 'GLV-KOR-RED',
    rating: 4.8,
    reviewsCount: 112,
    price: 3808,
    isPopular: true,
    isNew: false,
    tag: 'Koreya',
    inStock: true,
    stockCount: 3400,
    images: [
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Qizil rangli yuqori elastiklikka ega Koreya texnologiyasi asosidagi lateks qoplamali ishchi qo‘lqoplari.',
    specifications: {
      'Turi': 'Qizil lateks dushli qoplama',
      'Standart': 'EN388'
    },
    unit: 'juft',
    minOrder: 10
  },
  {
    id: 'snb-gloves-nitrile-coating',
    slug: 'nitril-qoplamali-qolqoplar',
    name: 'Nitril qoplamali qo‘lqoplar',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'NitriMax',
    sku: 'GLV-NTR-GRN',
    rating: 4.9,
    reviewsCount: 178,
    price: 5600,
    isPopular: true,
    isNew: false,
    tag: 'Nitril',
    inStock: true,
    stockCount: 1800,
    images: [
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Moy va neft mahsulotlariga chidamli yashil nitril qoplamali professional ishchi qo‘lqoplari.',
    specifications: {
      'Qoplama': 'Yashil to‘liq nitril qoplama',
      'Xususiyati': 'Moy, moylash vositalari va kimyoviy ta’sirlarga chidamli'
    },
    unit: 'juft',
    minOrder: 10
  },
  {
    id: 'snb-gloves-cotton-35g',
    slug: 'trikotaj-ishchi-paxta-qolqoplar-35g',
    name: 'Trikotaj ishchi paxta qo‘lqoplari 35gr',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'TextilePro',
    sku: 'GLV-COT-35G',
    rating: 4.9,
    reviewsCount: 230,
    price: 1400,
    isPopular: true,
    isNew: false,
    tag: '35gr x/b',
    inStock: true,
    stockCount: 5000,
    images: [
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80',
    ],
    description: '100% paxta ipli 35 grammli sifatli trikotaj ishchi qo‘lqopi. Qo‘lni terlatmaydi, eng ommabop B2B tanlov.',
    specifications: {
      'Vazni': '35 gramm',
      'Tarkibi': 'X/B paxta ipi',
      'Klass': '10-klass to‘qima'
    },
    unit: 'juft',
    minOrder: 50
  },

  // --- 2. MAISHIY KIMYO (CHEMICALS) ---
  {
    id: 'snb-vanish-oxi-500',
    slug: 'vanish-oxi-action-mato-dog-ketkazgich-500ml',
    name: 'Vanish Oxi Action mato dog‘ ketkazgichi 500ml',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Vanish',
    sku: 'CHM-VNS-500',
    rating: 4.9,
    reviewsCount: 140,
    price: 35952,
    isPopular: true,
    isNew: false,
    tag: '500 ml',
    inStock: true,
    stockCount: 420,
    images: [
      'https://images.unsplash.com/photo-1585670270608-b404fb88dd21?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Rangli va oq matolardagi eng qiyin dog‘larni samarali ketkazuvchi kislorodli suyuq vosita.',
    specifications: {
      'Hajmi': '500 ml',
      'Brend': 'Vanish Oxi Action',
      'Turi': 'Suyuq mato tozalagich'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-grass-steel-cleaner',
    slug: 'grass-zanglamas-polat-tozalash-vositasi',
    name: 'Grass zanglamas po‘lat tozalash vositasi',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Grass',
    sku: 'CHM-GRS-STL',
    rating: 4.8,
    reviewsCount: 95,
    price: 46200,
    isPopular: true,
    isNew: false,
    tag: 'Inox Cleaner',
    inStock: true,
    stockCount: 310,
    images: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Zanglamas po‘lat (inox), xrom va metall buyumlarni yaltiratuvchi va barmoq izlaridan himoya qiluvchi sprey.',
    specifications: {
      'Hajmi': '600 ml purkagich',
      'Ishlab chiqaruvchi': 'Grass Professional'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-grass-dos-toilet-block',
    slug: 'grass-dos-hojatxona-osma-bloki-3in1',
    name: 'Grass Dos hojatxona osma bloki 3in1',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Grass',
    sku: 'CHM-GRS-DOS',
    rating: 4.7,
    reviewsCount: 78,
    price: 14504,
    isPopular: true,
    isNew: false,
    tag: '3in1 Blok',
    inStock: true,
    stockCount: 650,
    images: [
      'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Unitaz va sanuzellar uchun yoqimli sitrus iforini taratuvchi, karash va bakteriyalardan saqlovchi osma blok.',
    specifications: {
      'Hidi': 'Sitrus / Limon',
      'Funksiyalari': 'Tozalash, gigiyena, xushbo‘ylantirish'
    },
    unit: 'dona',
    minOrder: 2
  },
  {
    id: 'snb-grass-polyrole-matte',
    slug: 'grass-polyrole-mat-plastik-jilolagich',
    name: 'Grass Polyrole mat plastik jilolagich',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Grass',
    sku: 'CHM-GRS-PLR',
    rating: 4.9,
    reviewsCount: 160,
    price: 64400,
    isPopular: true,
    isNew: false,
    tag: 'Matte Finish',
    inStock: true,
    stockCount: 280,
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Avtomobil panellari, plastik mebellar va ofis jihozlari uchun porlashsiz mot tozalovchi sprey.',
    specifications: {
      'Hajmi': '500 ml trigger',
      'Effekt': 'Tabiiy mat ko‘rinish va chang qaytaruvchi antistatik qatlam'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-vanish-carpet-gold',
    slug: 'vanish-gold-gilam-yuvish-shampuni',
    name: 'Vanish Gold gilam yuvish shampuni',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Vanish',
    sku: 'CHM-VNS-GLD',
    rating: 4.8,
    reviewsCount: 115,
    price: 59976,
    isPopular: true,
    isNew: false,
    tag: 'Gold Pro',
    inStock: true,
    stockCount: 220,
    images: [
      'https://images.unsplash.com/photo-1585670270608-b404fb88dd21?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Gilamlar, kovrolin va yumshoq mebellarni qo‘lda va klining mashinalarida chuqur tozalash uchun konsentrat.',
    specifications: {
      'Hajmi': '450 ml',
      'Brend': 'Vanish Gold'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-grass-antigraffiti',
    slug: 'grass-antigraffiti-dog-ketkazuvchi-vosita',
    name: 'Grass Antigraffiti dog‘ ketkazuvchi vosita',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Grass',
    sku: 'CHM-GRS-GRF',
    rating: 4.9,
    reviewsCount: 84,
    price: 120400,
    isPopular: true,
    isNew: false,
    tag: 'AntiGraffiti',
    inStock: true,
    stockCount: 150,
    images: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Bo‘yoq, skotch izlari, marker, graffiti va yopishqoq qoldiqlarni har qanday sirtlardan tozalovchi professional tarkib.',
    specifications: {
      'Hajmi': '600 ml',
      'Kategoriya': 'Maxsus professional tozalagich'
    },
    unit: 'dona',
    minOrder: 1
  },

  // --- 3. SIZNI QIZIQTIRISHI MUMKIN / OMMABOP MAHSULOTLAR ---
  {
    id: 'snb-gloves-cotton-45g',
    slug: 'trikotaj-ishchi-paxta-qolqoplari-45g',
    name: 'Trikotaj ishchi paxta qo‘lqoplari 45gr',
    categoryId: 'himoya-vositalari',
    categoryName: 'Himoya vositalari',
    brand: 'TextilePro',
    sku: 'GLV-COT-45G',
    rating: 5.0,
    reviewsCount: 310,
    price: 1456,
    isPopular: true,
    isNew: false,
    tag: 'Xit savdo',
    inStock: true,
    stockCount: 8000,
    images: [
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Zichligi yuqori 45 grammli qalin paxta ishchi qo‘lqoplari. Og‘ir jismoniy va ombor ishlari uchun mustahkam.',
    specifications: {
      'Vazni': '45 gramm',
      'Material': 'X/B paxta'
    },
    unit: 'juft',
    minOrder: 50
  },
  {
    id: 'snb-glade-aerosol-300',
    slug: 'glade-havo-xushboylantiruvchi-aerozol-300ml',
    name: 'Glade aerozol 300ml',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'Glade',
    sku: 'AIR-GLD-300',
    rating: 4.8,
    reviewsCount: 195,
    price: 29792,
    isPopular: true,
    isNew: false,
    tag: '300 ml',
    inStock: true,
    stockCount: 540,
    images: [
      'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Ofis va xonalar uchun uzoq vaqt saqlanuvchi tabiiy gul va tog‘ ifori bilan to‘ldirilgan aerozol.',
    specifications: {
      'Hajmi': '300 ml',
      'Brend': 'Glade SC Johnson'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-plastic-barrel',
    slug: 'bochka-plastikovaya-oq-50l',
    name: 'Bochka plastik oq',
    categoryId: 'kanselyariya',
    categoryName: 'Kanselyariya va xo‘jalik',
    brand: 'PlastMaster',
    sku: 'BCH-PLT-50L',
    rating: 4.7,
    reviewsCount: 52,
    price: 22960,
    isPopular: true,
    isNew: false,
    tag: 'Keng og‘izli',
    inStock: true,
    stockCount: 160,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Kimyoviy suyuqliklar, yuvish vositalari va suv saqlash uchun germetik qopqoqli oq plastik bochka.',
    specifications: {
      'Hajmi': '50 Litr',
      'Material': 'Birlamchi oziq-ovqat va kimyo plastigi'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-plastic-bucket',
    slug: 'qopqoqli-plastik-chelak-10l',
    name: 'Qopqoqli plastik chelak',
    categoryId: 'kanselyariya',
    categoryName: 'Kanselyariya va xo‘jalik',
    brand: 'CleanTub',
    sku: 'CHK-PLT-10L',
    rating: 4.8,
    reviewsCount: 74,
    price: 27440,
    isPopular: true,
    isNew: false,
    tag: 'Qopqoqli',
    inStock: true,
    stockCount: 380,
    images: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Tozalash ishlari va xo‘jalik ehtiyojlari uchun baquvvat metall tutqichli va germetik qopqoqli chelak.',
    specifications: {
      'Hajmi': '10 Litr',
      'Tutqich': 'Mustahkam metall'
    },
    unit: 'dona',
    minOrder: 1
  },
  {
    id: 'snb-napkins-elma-33',
    slug: 'elma-33x33-classic-salfetkalari',
    name: 'Salfetki Elma 33x33 Classic (221)',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Elma',
    sku: 'SLF-ELM-33',
    rating: 4.9,
    reviewsCount: 168,
    price: 6944,
    isPopular: true,
    isNew: false,
    tag: '33x33 sm',
    inStock: true,
    stockCount: 1200,
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Oshxona, kofe-breyk va korporativ tadbirlar uchun oq rangli 1 qavatli Elma salfetkalari.',
    specifications: {
      'O‘lchami': '33 x 33 sm',
      'Soni': '100 dona qadoqda'
    },
    unit: 'qadoq',
    minOrder: 5
  },

  // --- 4. YANGI KELGANLAR (NEW ARRIVALS - TELLUX VA QOG‘OZ MAHSULOTLARI) ---
  {
    id: 'snb-tellux-z2-towels',
    slug: 'tellux-z2-bargli-qogoz-sochiqlar',
    name: 'Bargli qog‘oz sochiqlar Z-taxlam 2 qavat Tellux Action',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Tellux',
    sku: 'TLX-Z2-ACT',
    rating: 4.9,
    reviewsCount: 62,
    price: 28000,
    isPopular: false,
    isNew: true,
    tag: '2 qavatli',
    inStock: true,
    stockCount: 450,
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Dispenserlar uchun Z-shaklda taxlangan 2 qavatli yuqori sifatli yumshoq qog‘oz sochiqlar.',
    specifications: {
      'Taxlam turi': 'Z-taxlam (multifold)',
      'Qatlamlar': '2 qavatli 100% sellyuloza',
      'Qadoqda': '200 dona'
    },
    unit: 'qadoq',
    minOrder: 2
  },
  {
    id: 'snb-tellux-zz1-towels',
    slug: 'tellux-zz1-bargli-sochiqlar-standart',
    name: 'Bargli sochiqlar ZZ 1 qavat Standart Tellux',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Tellux',
    sku: 'TLX-ZZ1-STD',
    rating: 4.8,
    reviewsCount: 45,
    price: 23000,
    isPopular: false,
    isNew: true,
    tag: '1 qavat Standart',
    inStock: true,
    stockCount: 520,
    images: [
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Tejamkor 1 qavatli dispenser uchun bargli sochiqlar to‘plami. Katta oqimli sanuzellar uchun ideal.',
    specifications: {
      'Turi': 'ZZ 1 qatlam Standart',
      'Qadoqda': '250 dona'
    },
    unit: 'qadoq',
    minOrder: 2
  },
  {
    id: 'snb-tellux-zz2-comfort',
    slug: 'tellux-zz2-qogoz-sochiqlar-komfort',
    name: 'Bargli qog‘oz sochiqlar ZZ 2 qavat Komfort Tellux',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Tellux',
    sku: 'TLX-ZZ2-CMF',
    rating: 4.9,
    reviewsCount: 38,
    price: 22000,
    isPopular: false,
    isNew: true,
    tag: '2 qavat Komfort',
    inStock: true,
    stockCount: 390,
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Yumshoqlik va nam tortish xususiyati yuqori bo‘lgan Komfort seriyasidagi 2 qavatli qog‘oz sochiq.',
    specifications: {
      'Turi': 'ZZ 2 qatlam Komfort',
      'Material': 'Birlamchi sellyuloza'
    },
    unit: 'qadoq',
    minOrder: 2
  },
  {
    id: 'snb-toilet-paper-giant-roll',
    slug: 'katta-rulonli-tualet-qogozi-standart',
    name: 'Katta rulonli tualet qog‘ozi 1 qavat Standart (Jumbo)',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Tellux Maxi',
    sku: 'TLX-JMB-54K',
    rating: 4.9,
    reviewsCount: 56,
    price: 54000,
    isPopular: false,
    isNew: true,
    tag: 'Jumbo Maxi',
    inStock: true,
    stockCount: 280,
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Katta dispenserlar uchun mo‘ljallangan diametri katta gigiyenik tualet qog‘ozi ruloni.',
    specifications: {
      'Rulon uzunligi': '150-200 metr',
      'Standart': '1 qavatli oq'
    },
    unit: 'rulon',
    minOrder: 2
  },
  {
    id: 'snb-toilet-paper-mini-2ply',
    slug: 'mini-rulonli-tualet-qogozi-2-qavat-komfort',
    name: 'Mini rulonli tualet qog‘ozi 2 qavat Komfort Tellux',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Tellux',
    sku: 'TLX-MNI-2PL',
    rating: 4.8,
    reviewsCount: 42,
    price: 24000,
    isPopular: false,
    isNew: true,
    tag: 'Mini 2 qavat',
    inStock: true,
    stockCount: 620,
    images: [
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Ixcham dispenserlar va standart hojatxona ushlagichlari uchun 2 qavatli mayin tualet qog‘ozi.',
    specifications: {
      'Qatlamlar': '2 qavatli perforatsiyalangan',
      'Seriya': 'Komfort Tellux'
    },
    unit: 'qadoq',
    minOrder: 4
  },
  {
    id: 'snb-toilet-paper-mini-1ply',
    slug: 'mini-rulonli-tualet-qogozi-1-qavat-standart',
    name: 'Mini rulonli tualet qog‘ozi 1 qavat Standart Tellux',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'Tellux',
    sku: 'TLX-MNI-1PL',
    rating: 4.7,
    reviewsCount: 39,
    price: 21000,
    isPopular: false,
    isNew: true,
    tag: 'Mini 1 qavat',
    inStock: true,
    stockCount: 710,
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Tejamkor va sifatli mini rulonli Standart seriyasidagi 1 qavatli tualet qog‘ozi.',
    specifications: {
      'Qatlamlar': '1 qavatli oq',
      'Seriya': 'Standart Tellux'
    },
    unit: 'qadoq',
    minOrder: 4
  },

  // --- 5. QO‘SHIMCHA ASOSIY MAHSULOTLAR ---
  {
    id: 'snb-001',
    slug: 'suyuq-sovun-5l',
    name: 'Suyuq sovun 5L SNABTASH',
    categoryId: 'maishiy-kimyo',
    categoryName: 'Maishiy kimyo',
    brand: 'SNABTASH',
    sku: 'SS-5L',
    rating: 4.8,
    reviewsCount: 124,
    price: 38500,
    oldPrice: 45000,
    isPopular: true,
    isNew: false,
    tag: 'Premium 5L',
    inStock: true,
    stockCount: 450,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Yuqori sifatli antibakterial suyuq sovun. Terini quritmaydi, yoqimli hid va yumshoqlik ta’sirga ega.',
    specifications: {
      'Hajmi': '5 Litr (Kanistra)',
      'Konsentratsiya': 'Yuqori ko‘pikli antibakterial formula'
    },
    unit: 'kanistra',
    minOrder: 1
  },
  {
    id: 'snb-004',
    slug: 'chiqindi-paketi-60l-20-dona',
    name: 'Chiqindi paketi 60L (20 dona)',
    categoryId: 'gigiyena',
    categoryName: 'Gigiyena',
    brand: 'CleanPack',
    sku: 'CP-60L',
    rating: 4.7,
    reviewsCount: 86,
    price: 18900,
    oldPrice: 22000,
    isPopular: true,
    isNew: false,
    tag: '60L, 20 dona',
    inStock: true,
    stockCount: 1200,
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Yuqori mustahkamlikka ega bo‘lgan 60 litrli chiqindi xaltalari ruloni. Yirtilishga chidamli polietilen.',
    specifications: {
      'Hajmi': '60 Litr',
      'Soni': '20 dona / rulon'
    },
    unit: 'rulon',
    minOrder: 1
  },
  {
    id: 'snb-012',
    slug: 'svetocopy-a4-qogoz',
    name: 'Ofis qog‘ozi SvetoCopy A4 (500 varaq)',
    categoryId: 'kanselyariya',
    categoryName: 'Kanselyariya',
    brand: 'SvetoCopy',
    sku: 'SC-A4',
    rating: 5.0,
    reviewsCount: 340,
    price: 46000,
    isPopular: true,
    isNew: false,
    tag: 'Bestseller',
    inStock: true,
    stockCount: 2500,
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Printer va kserokslar uchun C-klass standart 80g/m² ofis qog‘ozi.',
    specifications: {
      'Formati': 'A4 (210 x 297 mm)',
      'Zichligi': '80 g/m²',
      'Varaqlar soni': '500 varaq / pachka'
    },
    unit: 'pachka',
    minOrder: 1
  }
];
