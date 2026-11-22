from django.db import migrations

PARTNER_TRANSLATIONS = {
    'Pepsi': ('Pepsi', 'Напитки и продукты питания'),
    'Coca-Cola': ('Coca-Cola', 'Международный бренд'),
    'Artel Electronics': ('Artel Electronics', 'Бытовая техника'),
    'BETOMAX': ('BETOMAX', 'Бетон и строительство'),
    'BINOKOR': ('BINOKOR', 'Железобетонный комплекс'),
    'AGROMIR': ('AGROMIR', 'Агрохолдинг'),
    'UZTELECOM': ('UZTELECOM', 'Телеком и связь'),
    'Beta Plus': ('Beta Plus', 'Производство'),
}

CATEGORY_TRANSLATIONS = {
    'Ichimliklar & Oziq-ovqat': 'Напитки и продукты питания',
    'Xalqaro brend': 'Международный бренд',
    'Maishiy texnika': 'Бытовая техника',
    'Beton & Qurilish': 'Бетон и строительство',
    'Temir-beton majmuasi': 'Железобетонный комплекс',
    'Agro holding': 'Агрохолдинг',
    'Telekom & Aloqa': 'Телеком и связь',
    'Ishlab chiqarish': 'Производство',
}

def populate_ru_translations(apps, schema_editor):
    Partner = apps.get_model('settings_app', 'Partner')
    for partner in Partner.objects.all():
        updated = False
        if not partner.name_ru:
            if partner.name in PARTNER_TRANSLATIONS:
                partner.name_ru = PARTNER_TRANSLATIONS[partner.name][0]
            else:
                partner.name_ru = partner.name
            updated = True
        if not partner.category_ru:
            if partner.name in PARTNER_TRANSLATIONS:
                partner.category_ru = PARTNER_TRANSLATIONS[partner.name][1]
            elif partner.category in CATEGORY_TRANSLATIONS:
                partner.category_ru = CATEGORY_TRANSLATIONS[partner.category]
            else:
                partner.category_ru = partner.category
            updated = True
        if updated:
            partner.save(update_fields=['name_ru', 'category_ru'])

def reverse_ru_translations(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('settings_app', '0012_partner_category_ru_partner_name_ru'),
    ]

    operations = [
        migrations.RunPython(populate_ru_translations, reverse_ru_translations),
    ]
