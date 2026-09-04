import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.products.models import Category, Product, ProductImage
from apps.settings_app.models import SiteSettings
from apps.orders.models import CustomerContact, RequestOrder, OrderItem


class Command(BaseCommand):
    help = 'Seeds SNABTASH database with all categories, products, site settings, and demo B2B orders'

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        seed_path = base_dir / 'seed_data.json'

        if not seed_path.exists():
            self.stderr.write(self.style.ERROR(f"Seed file not found at {seed_path}"))
            return

        with open(seed_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        categories_data = data.get('categories', [])
        products_data = data.get('products', [])

        self.stdout.write(self.style.MIGRATE_HEADING("1. Seeding Categories..."))
        cat_map = {}
        for idx, c in enumerate(categories_data):
            cat, created = Category.objects.update_or_create(
                id=c['id'],
                defaults={
                    'slug': c.get('slug', c['id']),
                    'name': c['name'],
                    'icon': c.get('icon', 'Sparkles'),
                    'image': c.get('image', ''),
                    'description': c.get('description', ''),
                    'order': idx,
                }
            )
            cat_map[c['id']] = cat
            self.stdout.write(f"  {'Created' if created else 'Updated'} Category: {cat.name}")

        self.stdout.write(self.style.MIGRATE_HEADING("\n2. Seeding Products..."))
        for p in products_data:
            cat_id = p.get('categoryId')
            category = cat_map.get(cat_id) or Category.objects.first()

            features = []
            specs = p.get('specifications') or p.get('features')
            if isinstance(specs, dict):
                features = [{'name': k, 'value': str(v)} for k, v in specs.items()]
            elif isinstance(specs, list):
                features = specs

            product, created = Product.objects.update_or_create(
                id=p['id'],
                defaults={
                    'slug': p.get('slug', p['id']),
                    'name': p['name'],
                    'category': category,
                    'brand': p.get('brand', 'SNABTASH'),
                    'sku': p.get('sku', f"SKU-{p['id']}"),
                    'price': p.get('price', 0),
                    'old_price': p.get('oldPrice'),
                    'unit': p.get('unit', 'dona'),
                    'min_order': p.get('minOrder', 1),
                    'in_stock': p.get('inStock', True),
                    'is_popular': p.get('isPopular', False),
                    'is_new': p.get('isNew', False),
                    'tag': p.get('tag', ''),
                    'rating': p.get('rating', 5.0),
                    'reviews_count': p.get('reviewsCount', 0),
                    'description': p.get('description', ''),
                    'features': features,
                }
            )

            # Seed images
            product.product_images.all().delete()
            images = p.get('images', [])
            for idx, img_url in enumerate(images):
                ProductImage.objects.create(
                    product=product,
                    image_url=img_url,
                    is_main=(idx == 0),
                    order=idx
                )

            self.stdout.write(f"  {'Created' if created else 'Updated'} Product: {product.name} ({product.sku})")

        self.stdout.write(self.style.MIGRATE_HEADING("\n3. Seeding Site Settings..."))
        SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                'company_name': 'SNABTASH B2B',
                'phone_1': '+998 87 034 97 79',
                'phone_2': '+998 90 123 45 67',
                'email': 'info@snabtash.uz',
                'telegram_bot': '@snabtash_bot',
                'telegram_channel': 'https://t.me/snabtash',
                'address': 'Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi, 42-uy',
                'work_hours': 'Dush - Shan: 08:30 - 18:30',
                'inn': '309871234',
                'mfo': '00440',
                'bank_account': '20208000900123456001',
                'bank_name': 'ATB "Kapitalbank" Chilonzor filiali',
                'free_delivery_threshold': 500000,
                'delivery_cost': 35000,
                'banner_headline': 'Korxonangiz Uchun Barcha Ta’minot',
                'banner_subtitle': 'Ishingiz uchun sifatli klining kimyolari, xo‘jalik mollari va gigiyena tovarlarini to‘g‘ridan-to‘g‘ri ombordan oling.',
                'banner_discount_badge': 'Maxsus B2B Taklif • 20% Chegirma',
            }
        )
        self.stdout.write(self.style.SUCCESS("  Site settings updated!"))

        self.stdout.write(self.style.MIGRATE_HEADING("\n4. Seeding Demo B2B Orders & Customers..."))
        demo_orders = [
            {
                'id': '1048',
                'customer': {
                    'name': 'Otabek Mahkamov',
                    'phone': '+998 93 456 78 90',
                    'company': 'Akfa Engineering MChJ',
                    'inn': '201948271',
                },
                'status': 'Ko‘rib chiqilmoqda',
                'comment': 'Didox orqali hisob-faktura yuboring, to‘lov 100% o‘tkazma.',
                'items': [
                    ('snb-gloves-orange', 20),
                    ('snb-paper-svetocopy-a4', 15),
                ]
            },
            {
                'id': '1047',
                'customer': {
                    'name': 'Dilshod Rahmatov',
                    'phone': '+998 90 987 65 43',
                    'company': 'Artel Ta’minot Bo‘limi',
                    'inn': '305128941',
                },
                'status': 'Tasdiqlangan',
                'comment': 'Ertaga soat 14:00 gacha zavod omboriga yetkazish zarur.',
                'items': [
                    ('snb-floor-cleaner-lavender', 10),
                    ('snb-dispenser-towel-v', 5),
                ]
            },
            {
                'id': '1046',
                'customer': {
                    'name': 'Nodirbek Quchqarov',
                    'phone': '+998 90 123 45 67',
                    'company': 'Orient Group Holding',
                    'inn': '301298455',
                },
                'status': 'Yetkazilmoqda',
                'comment': 'Haydovchi yetib borsa, qorovulxonadan qo‘ng‘iroq qilsin.',
                'items': [
                    ('snb-antifreeze-g12-red', 8),
                    ('snb-auto-shampoo-active', 6),
                ]
            },
            {
                'id': '1045',
                'customer': {
                    'name': 'Javohir Zokirov',
                    'phone': '+998 97 712 33 44',
                    'company': 'Murad Buildings Qurilish',
                    'inn': '304918239',
                },
                'status': 'Bajarildi',
                'comment': 'Barcha tovarlar qabul qilindi, shartnoma yopildi.',
                'items': [
                    ('snb-trash-bags-120l-heavy', 50),
                    ('snb-liquid-soap-5l', 12),
                ]
            },
            {
                'id': '1044',
                'customer': {
                    'name': 'Alisher Vohidov',
                    'phone': '+998 99 888 11 22',
                    'company': 'Grand Pharm Retail',
                    'inn': '307819201',
                },
                'status': 'Bekor qilingan',
                'comment': 'Mijoz boshqa partiya bilan birlashtirishni so‘radi.',
                'items': [
                    ('snb-mask-3m-n95', 40),
                ]
            },
        ]

        for ord_data in demo_orders:
            cust = ord_data['customer']
            contact, _ = CustomerContact.objects.get_or_create(
                phone=cust['phone'],
                defaults={
                    'name': cust['name'],
                    'company': cust['company'],
                    'inn': cust['inn'],
                }
            )

            order, created = RequestOrder.objects.update_or_create(
                id=ord_data['id'],
                defaults={
                    'customer': contact,
                    'customer_name': cust['name'],
                    'customer_phone': cust['phone'],
                    'customer_company': cust['company'],
                    'customer_inn': cust['inn'],
                    'comment': ord_data.get('comment', ''),
                    'status': ord_data['status'],
                    'total_amount': 0,
                }
            )

            order.items.all().delete()
            total_sum = 0
            for prod_id, qty in ord_data['items']:
                p = Product.objects.filter(id=prod_id).first()
                if p:
                    p_name = p.name
                    p_sku = p.sku
                    p_price = p.price
                    p_img = p.product_images.first().image_url if p.product_images.exists() else ''
                else:
                    p_name = 'B2B Tovar'
                    p_sku = 'SKU-DEMO'
                    p_price = 50000
                    p_img = ''

                it_total = p_price * qty
                total_sum += it_total
                OrderItem.objects.create(
                    order=order,
                    product=p,
                    product_name=p_name,
                    product_sku=p_sku,
                    product_image=p_img,
                    price=p_price,
                    quantity=qty,
                    total_price=it_total,
                )

            order.total_amount = total_sum
            order.save(update_fields=['total_amount'])
            self.stdout.write(f"  {'Created' if created else 'Updated'} Order #{order.id} ({order.customer_name} - {order.total_amount:,} so‘m)")

        self.stdout.write(self.style.SUCCESS("\nSuccessfully seeded all SNABTASH data into Django database!"))
