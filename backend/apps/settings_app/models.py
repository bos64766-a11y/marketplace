from django.db import models


class SiteSettings(models.Model):
    company_name = models.CharField(max_length=255, default='SNABTASH B2B')
    phone_1 = models.CharField(max_length=50, default='+998 87 034 97 79')
    phone_2 = models.CharField(max_length=50, default='+998 90 123 45 67')
    email = models.EmailField(default='info@snabtash.uz')
    telegram_bot = models.CharField(max_length=100, default='@snabtash_bot')
    telegram_channel = models.CharField(max_length=255, default='https://t.me/snabtash')
    address = models.TextField(default='Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy')
    work_hours = models.CharField(max_length=100, default='Dush - Shan: 08:30 - 18:30')
    inn = models.CharField(max_length=50, default='309871234')
    mfo = models.CharField(max_length=50, default='00440')
    bank_account = models.CharField(max_length=100, default='20208000900123456001')
    bank_name = models.CharField(max_length=255, default='ATB "Kapitalbank" Chilonzor filiali')
    free_delivery_threshold = models.DecimalField(max_digits=14, decimal_places=2, default=500000)
    delivery_cost = models.DecimalField(max_digits=14, decimal_places=2, default=35000)
    banner_headline = models.CharField(max_length=255, default='Korxonangiz Uchun Barcha Ta’minot')
    banner_subtitle = models.TextField(default='Ishingiz uchun sifatli klining kimyolari, xo‘jalik mollari va gigiyena tovarlarini to‘g‘ridan-to‘g‘ri ombordan oling.')
    banner_discount_badge = models.CharField(max_length=255, default='Maxsus B2B Taklif • 20% Chegirma')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Sayt sozlamalari'
        verbose_name_plural = 'Sayt sozlamalari'

    def __str__(self):
        return self.company_name

    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(id=1)
        return settings


class Banner(models.Model):
    badge = models.CharField(max_length=100, blank=True, default='', verbose_name='Badge')
    title = models.CharField(max_length=255, blank=True, default='Banner', verbose_name='Sarlavha')
    description = models.TextField(blank=True, default='', verbose_name='Tavsif')
    btn_text = models.CharField(max_length=100, blank=True, default='', verbose_name='Tugma matni')
    btn_link = models.CharField(max_length=255, blank=True, default='/catalog', verbose_name='Tugma havolasi')
    image = models.CharField(max_length=500, default='/banners/banner-clean-promo.png', verbose_name='Rasm URL')
    image_alt = models.CharField(max_length=255, blank=True, default='', verbose_name='Rasm tavsifi')
    order = models.IntegerField(default=0, verbose_name='Tartib')
    is_active = models.BooleanField(default=True, verbose_name='Faol')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Banner'
        verbose_name_plural = 'Bannerlar'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.title or 'Banner'} ({self.image})"


class ShowcaseSection(models.Model):
    title = models.CharField(max_length=255, verbose_name='Sarlavha')
    subtitle = models.CharField(max_length=500, blank=True, default='', verbose_name='Quyi sarlavha')
    badge = models.CharField(max_length=100, blank=True, default='', verbose_name='Badge')
    icon = models.CharField(max_length=100, blank=True, default='Building2', verbose_name='Icon')
    link = models.CharField(max_length=255, blank=True, default='/catalog', verbose_name='Havola')
    product_ids = models.JSONField(default=list, blank=True, verbose_name='Mahsulotlar ID lari')
    order = models.IntegerField(default=0, verbose_name='Tartib')
    is_active = models.BooleanField(default=True, verbose_name='Faol')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Bosh sahifa bo‘limi'
        verbose_name_plural = 'Bosh sahifa bo‘limlari'
        ordering = ['order', 'id']

    def __str__(self):
        return self.title

