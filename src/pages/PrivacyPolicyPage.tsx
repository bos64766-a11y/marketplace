import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { language, navigate, siteSettings } = useApp();
  const isRu = language === 'ru';

  const phone1 = siteSettings?.phone1 || '+998 87 034 97 79';
  const rawPhone2 = siteSettings?.phone2 || '+998 93 097 96 20';
  const phone2 = rawPhone2 && rawPhone2.replace(/\D/g, '') !== '998901234567' ? rawPhone2 : '+998 93 097 96 20';
  const email = siteSettings?.email || 'regbirolls@gmail.com';
  const telegramBot = siteSettings?.telegramBot || '@snabtash_bot';
  const inn = siteSettings?.inn || '312622484';

  useSEO({
    title: isRu
      ? 'Политика конфиденциальности — SNAB.UZ | ООО «SNABTASH»'
      : 'Maxfiylik siyosati — SNAB.UZ | «SNABTASH» MChJ',
    description: isRu
      ? 'Политика конфиденциальности сайта snab.uz (ООО «SNABTASH», ИНН 312622484). Порядок сбора, хранения и защиты персональных данных в соответствии с законодательством РУз.'
      : 'snab.uz saytining maxfiylik siyosati («SNABTASH» MChJ, STIR 312622484). Shaxsga doir maʼlumotlarni yigʻish, saqlash va himoya qilish tartibi.',
    keywords: isRu
      ? 'политика конфиденциальности snab uz, персональные данные snabtash, пользовательское соглашение'
      : 'maxfiylik siyosati snab uz, shaxsiy maʼlumotlar himoyasi snabtash',
    url: '/privacy',
    lang: language,
    breadcrumbs: [
      { name: isRu ? 'Главная' : 'Bosh sahifa', item: '/' },
      { name: isRu ? 'Политика конфиденциальности' : 'Maxfiylik siyosati', item: '/privacy' },
    ],
  });

  if (isRu) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#FF5A00] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>На главную</span>
        </button>

        <article className="bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-10 shadow-xs space-y-6 text-[#14213D]">
          <header className="pb-6 border-b border-[#E5EAF2] space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF5A00]/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Правовая информация</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E73] tracking-tight">
              Политика конфиденциальности
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] font-medium">
              Дата публикации: 27.11.2026
            </p>
          </header>

          <div className="space-y-6 text-sm leading-relaxed text-[#334155]">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">1. Общие положения</h2>
              <p>
                Настоящая Политика описывает, как ООО «SNABTASH» (далее — «Компания», «мы»), ИНН {inn}, адрес: г. Ташкент, Чорсу мавзеси, дом 17, собирает, использует и защищает персональные данные посетителей сайта snab.uz и лиц, оставивших заявку через сайт, рекламные формы, телефон или мессенджеры.
              </p>
              <p>
                Политика составлена в соответствии с Законом Республики Узбекистан «О персональных данных». Отправляя заявку или сообщая нам свои данные, вы соглашаетесь с условиями этой Политики.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">2. Какие данные мы собираем</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>имя и фамилию;</li>
                <li>номер телефона;</li>
                <li>название компании и должность, если вы их указали;</li>
                <li>содержание заявки: интересующие товары, объём, комментарий;</li>
                <li>технические данные о посещении сайта: IP-адрес, тип устройства и браузера, просмотренные страницы, источник перехода, файлы cookie.</li>
              </ul>
              <p>
                Мы не собираем специальные категории персональных данных и не запрашиваем платёжные данные через сайт.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">3. Для чего мы используем данные</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>чтобы связаться с вами по заявке и подготовить коммерческое предложение;</li>
                <li>чтобы оформить и выполнить заказ, организовать доставку;</li>
                <li>чтобы отвечать на вопросы и обращения;</li>
                <li>чтобы анализировать работу сайта и рекламы и улучшать их.</li>
              </ul>
              <p>
                Мы не используем ваши контактные данные для рассылок без вашего отдельного согласия.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">4. Передача данных третьим лицам</h2>
              <p>Мы не продаём и не передаём ваши данные третьим лицам для их собственных целей. Данные могут обрабатываться:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>службами доставки и подрядчиками — в объёме, необходимом для выполнения вашего заказа;</li>
                <li>рекламными и аналитическими сервисами Google (Google Ads) и Яндекс (Яндекс Директ, Яндекс Метрика) — когда вы заполняете форму в рекламном объявлении или посещаете сайт; эти сервисы обрабатывают данные по собственным политикам конфиденциальности;</li>
                <li>государственными органами — в случаях, прямо предусмотренных законодательством Республики Узбекистан.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">5. Файлы cookie и аналитика</h2>
              <p>
                Сайт использует файлы cookie и счётчик Яндекс Метрики, чтобы понимать, как посетители пользуются сайтом и откуда они приходят. Вы можете отключить cookie в настройках браузера; при этом часть функций сайта может работать некорректно.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">6. Хранение и защита данных</h2>
              <p>
                Мы храним персональные данные не дольше, чем это нужно для целей, указанных в разделе 3, или чем требует законодательство. Доступ к данным имеют только сотрудники, которым он необходим для работы с заявками и заказами. Мы применяем организационные и технические меры для защиты данных от несанкционированного доступа, изменения и утраты.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">7. Ваши права</h2>
              <p>Вы вправе:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>узнать, какие ваши данные мы храним и как их используем;</li>
                <li>потребовать исправить неточные данные;</li>
                <li>отозвать согласие на обработку и потребовать удалить данные.</li>
              </ul>
              <p>
                Для этого напишите нам на{' '}
                <a href={`mailto:${email}`} className="text-[#FF5A00] font-semibold hover:underline">
                  {email}
                </a>{' '}
                или позвоните по телефону{' '}
                <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="text-[#FF5A00] font-semibold hover:underline">
                  {phone1}
                </a>
                . Мы ответим в срок, установленный законодательством.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73]">8. Изменение Политики</h2>
              <p>
                Мы можем обновлять эту Политику. Актуальная версия всегда опубликована на этой странице с указанием даты публикации.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-2">
              <h2 className="text-lg font-bold text-[#0B2E73] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF5A00]" />
                <span>9. Контакты</span>
              </h2>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-[#14213D]">ООО «SNABTASH» (ИНН {inn})</p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <span>Адрес: г. Ташкент, Чорсу мавзеси, дом 17</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <span>
                    Телефон:{' '}
                    <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="font-semibold hover:text-[#FF5A00]">
                      {phone1}
                    </a>
                    {phone2 && (
                      <>
                        {', '}
                        <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="font-semibold hover:text-[#FF5A00]">
                          {phone2}
                        </a>
                      </>
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                  <span>
                    E-mail:{' '}
                    <a href={`mailto:${email}`} className="font-semibold hover:text-[#FF5A00]">
                      {email}
                    </a>
                  </span>
                </p>
                <p>Telegram: {telegramBot}</p>
              </div>
            </section>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#FF5A00] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </button>

      <article className="bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-10 shadow-xs space-y-6 text-[#14213D]">
        <header className="pb-6 border-b border-[#E5EAF2] space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#FF5A00]/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Huquqiy maʼlumot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E73] tracking-tight">
            Maxfiylik siyosati
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] font-medium">
            Eʼlon qilingan sana: 27.11.2026
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-[#334155]">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">1. Umumiy qoidalar</h2>
            <p>
              Ushbu Siyosat «SNABTASH» MChJ (keyingi oʻrinlarda — «Kompaniya», «biz»), STIR {inn}, manzil: Toshkent sh., Chorsu mavzesi, 17-uy, snab.uz sayti tashrif buyuruvchilarining hamda sayt, reklama shakllari, telefon yoki messenjerlar orqali ariza qoldirgan shaxslarning shaxsga doir maʼlumotlarini qanday yigʻishi, ishlatishi va himoya qilishini tushuntiradi.
            </p>
            <p>
              Siyosat Oʻzbekiston Respublikasining «Shaxsga doir maʼlumotlar toʻgʻrisida»gi Qonuniga muvofiq tuzilgan. Ariza yuborish yoki maʼlumotlaringizni bizga berish orqali siz ushbu Siyosat shartlariga rozilik bildirasiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">2. Qanday maʼlumotlarni yigʻamiz</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>ism va familiya;</li>
              <li>telefon raqami;</li>
              <li>kompaniya nomi va lavozim, agar siz koʻrsatgan boʻlsangiz;</li>
              <li>ariza mazmuni: qiziqtirgan mahsulotlar, hajm, izoh;</li>
              <li>saytga tashrif haqidagi texnik maʼlumotlar: IP-manzil, qurilma va brauzer turi, koʻrilgan sahifalar, oʻtish manbai, cookie fayllari.</li>
            </ul>
            <p>
              Biz shaxsga doir maʼlumotlarning maxsus toifalarini yigʻmaymiz va sayt orqali toʻlov maʼlumotlarini soʻramaymiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">3. Maʼlumotlardan nima maqsadda foydalanamiz</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>arizangiz boʻyicha siz bilan bogʻlanish va tijorat taklifini tayyorlash uchun;</li>
              <li>buyurtmani rasmiylashtirish, bajarish va yetkazib berishni tashkil etish uchun;</li>
              <li>savol va murojaatlarga javob berish uchun;</li>
              <li>sayt va reklama ishini tahlil qilish hamda yaxshilash uchun.</li>
            </ul>
            <p>
              Alohida roziligingizsiz aloqa maʼlumotlaringizdan reklama xabarlari yuborish uchun foydalanmaymiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">4. Maʼlumotlarni uchinchi shaxslarga berish</h2>
            <p>Biz maʼlumotlaringizni uchinchi shaxslarga ularning oʻz maqsadlari uchun sotmaymiz va bermaymiz. Maʼlumotlar quyidagilar tomonidan qayta ishlanishi mumkin:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>yetkazib berish xizmatlari va pudratchilar — buyurtmangizni bajarish uchun zarur hajmda;</li>
              <li>Google (Google Ads) va Yandex (Yandex Direct, Yandex Metrika) reklama va tahlil xizmatlari — siz reklama eʼlonidagi shaklni toʻldirganingizda yoki saytga kirganingizda; bu xizmatlar maʼlumotlarni oʻz maxfiylik siyosatlariga muvofiq qayta ishlaydi;</li>
              <li>davlat organlari — Oʻzbekiston Respublikasi qonunchiligida toʻgʻridan-toʻgʻri nazarda tutilgan hollarda.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">5. Cookie fayllari va tahlil</h2>
            <p>
              Sayt tashrif buyuruvchilar saytdan qanday foydalanishini va qayerdan kelishini tushunish uchun cookie fayllari va Yandex Metrika hisoblagichidan foydalanadi. Cookie fayllarini brauzer sozlamalarida oʻchirib qoʻyishingiz mumkin; bunda saytning ayrim funksiyalari notoʻgʻri ishlashi mumkin.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">6. Maʼlumotlarni saqlash va himoya qilish</h2>
            <p>
              Shaxsga doir maʼlumotlarni 3-boʻlimda koʻrsatilgan maqsadlar uchun zarur boʻlgan yoki qonunchilik talab qilgan muddatdan ortiq saqlamaymiz. Maʼlumotlarga faqat ariza va buyurtmalar bilan ishlash uchun zarur boʻlgan xodimlar kira oladi. Maʼlumotlarni ruxsatsiz kirish, oʻzgartirish va yoʻqotishdan himoya qilish uchun tashkiliy va texnik choralarni qoʻllaymiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">7. Sizning huquqlaringiz</h2>
            <p>Siz quyidagi huquqlarga egasiz:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>qaysi maʼlumotlaringizni saqlayotganimiz va ulardan qanday foydalanayotganimizni bilish;</li>
              <li>notoʻgʻri maʼlumotlarni tuzatishni talab qilish;</li>
              <li>qayta ishlashga bergan roziligingizni qaytarib olish va maʼlumotlarni oʻchirishni talab qilish.</li>
            </ul>
            <p>
              Buning uchun bizga{' '}
              <a href={`mailto:${email}`} className="text-[#FF5A00] font-semibold hover:underline">
                {email}
              </a>{' '}
              manziliga yozing yoki{' '}
              <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="text-[#FF5A00] font-semibold hover:underline">
                {phone1}
              </a>{' '}
              raqamiga qoʻngʻiroq qiling. Qonunchilikda belgilangan muddatda javob beramiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73]">8. Siyosatni oʻzgartirish</h2>
            <p>
              Biz ushbu Siyosatni yangilashimiz mumkin. Amaldagi tahrir eʼlon qilingan sanasi koʻrsatilgan holda doimo shu sahifada joylashtiriladi.
            </p>
          </section>

          <section className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF2] space-y-2">
            <h2 className="text-lg font-bold text-[#0B2E73] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF5A00]" />
              <span>9. Aloqa</span>
            </h2>
            <div className="space-y-1.5 text-sm">
              <p className="font-bold text-[#14213D]">«SNABTASH» MChJ (STIR {inn})</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <span>Manzil: Toshkent sh., Chorsu mavzesi, 17-uy</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <span>
                  Telefon:{' '}
                  <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="font-semibold hover:text-[#FF5A00]">
                    {phone1}
                  </a>
                  {phone2 && (
                    <>
                      {', '}
                      <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="font-semibold hover:text-[#FF5A00]">
                        {phone2}
                      </a>
                    </>
                  )}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF5A00] shrink-0" />
                <span>
                  E-mail:{' '}
                  <a href={`mailto:${email}`} className="font-semibold hover:text-[#FF5A00]">
                    {email}
                  </a>
                </span>
              </p>
              <p>Telegram: {telegramBot}</p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
