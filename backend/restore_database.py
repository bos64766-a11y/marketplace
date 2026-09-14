"""
SNABTASH Database Restore Script
Restores all database tables, products, categories, orders (zakazlar), settings, banners, and partners
from backend/fixtures/live_backup.json or backup_data.json.

Can be run on any new server, Docker, Railway, Render, VPS or local machine:
python restore_database.py
"""
import os
import sys
import subprocess
import json

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def import_from_live_backup(bundle_path, backend_dir):
    """
    Import all categories, products, orders (zakazlar), showcase sections,
    banners, settings, and partners from live_backup.json using Django ORM.
    """
    import django
    from django.db import models

    sys.path.insert(0, backend_dir)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snabtash_core.settings')
    django.setup()

    from apps.products.models import Category, Product, ProductImage
    from apps.orders.models import RequestOrder, OrderItem, CustomerContact
    from apps.settings_app.models import ShowcaseSection, Banner, SiteSettings, Partner

    with open(bundle_path, 'r', encoding='utf-8') as f:
        bundle = json.load(f)

    data = bundle.get('data', {})

    print(f"\n[RESTORE] 'live_backup.json' dan tiklash boshlandi ({bundle.get('exported_at', '')})...")

    # 1. Categories
    cats = data.get('categories', [])
    for c in cats:
        cat_id = str(c.get('id') or c.get('slug'))
        Category.objects.update_or_create(
            id=cat_id,
            defaults={
                'slug': str(c.get('slug') or cat_id),
                'name': c.get('name', ''),
                'name_ru': c.get('name_ru', '') or '',
                'icon': c.get('icon', 'Package') or 'Package',
                'image': c.get('image', '') or '',
                'description': c.get('description', '') or '',
                'description_ru': c.get('description_ru', '') or '',
            }
        )
    print(f" -> [OK] {len(cats)} ta kategoriya saqlandi.")

    # 2. Products
    prods = data.get('products', [])
    for p in prods:
        cat_id = str(p.get('categoryId') or p.get('category_id') or p.get('category') or '')
        cat_obj = None
        if cat_id:
            cat_obj = Category.objects.filter(models.Q(id=cat_id) | models.Q(slug=cat_id)).first()
        if not cat_obj:
            cat_obj = Category.objects.first()

        prod_id = str(p.get('id'))
        prod_obj, _ = Product.objects.update_or_create(
            id=prod_id,
            defaults={
                'slug': str(p.get('slug') or prod_id),
                'name': p.get('name', ''),
                'name_ru': p.get('name_ru', '') or '',
                'category': cat_obj,
                'price': float(p.get('price', 0) or 0),
                'old_price': float(p.get('oldPrice') or p.get('old_price')) if (p.get('oldPrice') or p.get('old_price')) else None,
                'in_stock': bool(p.get('inStock', True)),
                'brand': p.get('brand', 'SNABTASH') or 'SNABTASH',
                'sku': p.get('sku', '') or f"SNB-{prod_id[-6:].upper()}",
                'unit': p.get('unit', 'dona') or 'dona',
                'min_order': int(p.get('minOrder', 1) or 1),
                'tag': p.get('tag', '') or '',
                'tag_ru': p.get('tag_ru', '') or '',
                'rating': float(p.get('rating', 4.5) or 4.5),
                'reviews_count': int(p.get('reviewsCount', 0) or 0),
                'description': p.get('description', '') or '',
                'description_ru': p.get('description_ru', '') or '',
                'is_popular': bool(p.get('isPopular', False)),
                'is_new': bool(p.get('isNew', False)),
            }
        )
        images = p.get('images', []) or p.get('images_list', [])
        if images:
            prod_obj.product_images.all().delete()
            for idx, img_url in enumerate(images):
                if img_url and str(img_url).strip():
                    ProductImage.objects.create(
                        product=prod_obj,
                        image_url=str(img_url).strip(),
                        is_main=(idx == 0),
                        order=idx
                    )
    print(f" -> [OK] {len(prods)} ta mahsulot saqlandi.")

    # 3. Orders (Zayavkalar / Zakazlar)
    orders = data.get('orders', [])
    for o in orders:
        order_id = str(o.get('id'))
        contact = o.get('contact', {})
        total_amt = float(o.get('totalAmount') or o.get('total_amount', 0) or 0)
        
        req_order, _ = RequestOrder.objects.update_or_create(
            id=order_id,
            defaults={
                'customer_name': contact.get('name', 'B2B Mijoz') or 'B2B Mijoz',
                'customer_phone': contact.get('phone', '') or '',
                'customer_company': contact.get('company', '') or '',
                'customer_inn': contact.get('inn', '') or '',
                'comment': contact.get('comment', '') or '',
                'total_amount': total_amt,
                'status': o.get('status', 'Ko‘rib chiqilmoqda') or 'Ko‘rib chiqilmoqda',
            }
        )
        items = o.get('items', [])
        if items:
            req_order.items.all().delete()
            for it in items:
                prod_info = it.get('product', {})
                p_id = prod_info.get('id')
                p_obj = Product.objects.filter(id=p_id).first() if p_id else None
                p_price = float(prod_info.get('price', 0) or 0)
                qty = int(it.get('quantity', 1) or 1)
                
                imgs = prod_info.get('images', [])
                p_img = imgs[0] if imgs else ''

                OrderItem.objects.create(
                    order=req_order,
                    product=p_obj,
                    product_name=prod_info.get('name', 'B2B Tovar'),
                    product_sku=prod_info.get('sku', '') or '',
                    product_image=p_img or '',
                    price=p_price,
                    quantity=qty,
                    total_price=p_price * qty
                )
    print(f" -> [OK] {len(orders)} ta zakaz (buyurtma) barcha tovarlari va mijozlari bilan tiklandi.")

    # 4. Showcase Sections
    sections = data.get('showcase-sections', [])
    for s in sections:
        sec_id = s.get('id')
        ShowcaseSection.objects.update_or_create(
            id=sec_id,
            defaults={
                'title': s.get('title', ''),
                'title_ru': s.get('title_ru', '') or '',
                'subtitle': s.get('subtitle', '') or '',
                'subtitle_ru': s.get('subtitle_ru', '') or '',
                'icon': s.get('icon', 'Star') or 'Star',
                'target_slug': str(s.get('targetSlug') or s.get('target_slug') or ''),
                'order': int(s.get('order', 0) or 0),
                'is_active': bool(s.get('isActive', True)),
                'tag': s.get('tag', '') or '',
                'tag_ru': s.get('tag_ru', '') or '',
            }
        )
    print(f" -> [OK] {len(sections)} ta bo'lim tiklandi.")

    # 5. Banners
    banners = data.get('banners', [])
    for b in banners:
        ban_id = b.get('id')
        Banner.objects.update_or_create(
            id=ban_id,
            defaults={
                'title': b.get('title', ''),
                'title_ru': b.get('title_ru', '') or '',
                'subtitle': b.get('subtitle', '') or '',
                'subtitle_ru': b.get('subtitle_ru', '') or '',
                'image': b.get('image', '') or '',
                'link': b.get('link', '') or '',
                'button_text': b.get('buttonText') or b.get('button_text', '') or '',
                'button_text_ru': b.get('buttonText_ru') or b.get('button_text_ru', '') or '',
                'order': int(b.get('order', 0) or 0),
                'is_active': bool(b.get('isActive', True)),
            }
        )
    print(f" -> [OK] {len(banners)} ta banner tiklandi.")

    # 6. Site Settings
    sett = data.get('settings', {})
    if sett and isinstance(sett, dict) and sett.get('companyName'):
        SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                'company_name': sett.get('companyName', 'SNABTASH'),
                'phone': sett.get('phone', '') or '',
                'email': sett.get('email', '') or '',
                'address': sett.get('address', '') or '',
                'address_ru': sett.get('address_ru', '') or '',
                'telegram': sett.get('telegram', '') or '',
                'working_hours': sett.get('workingHours') or sett.get('working_hours', '') or '',
                'working_hours_ru': sett.get('workingHours_ru') or sett.get('working_hours_ru', '') or '',
            }
        )
        print(" -> [OK] Sayt sozlamalari tiklandi.")

    # 7. Partners
    partners = data.get('partners', [])
    for part in partners:
        part_id = part.get('id')
        Partner.objects.update_or_create(
            id=part_id,
            defaults={
                'name': part.get('name', ''),
                'logo': part.get('logo', '') or '',
                'order': int(part.get('order', 0) or 0),
                'is_active': bool(part.get('isActive', True)),
            }
        )
    print(f" -> [OK] {len(partners)} ta hamkor brend tiklandi.")

    print("\n[MUVAFFAQIN] Yangi serverda barcha ma'lumotlar to'liq tiklandi!")
    return True


def run_restore():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    fixtures_dir = os.path.join(backend_dir, 'fixtures')
    live_backup_file = os.path.join(fixtures_dir, 'live_backup.json')
    legacy_backup_file = os.path.join(fixtures_dir, 'backup_data.json')

    print("=" * 60)
    print("[RESTORE] SNABTASH: Ma'lumotlar bazasini tiklash")
    print("=" * 60)

    # 1. Migrate first
    print("\n1. Baza jadvallarini yaratish / yangilash (migrate)...")
    try:
        subprocess.run(
            [sys.executable, os.path.join(backend_dir, "manage.py"), "migrate"],
            cwd=backend_dir,
            check=True
        )
        print("[OK] Jadvallar muvaffaqiyatli tayyorlandi.")
    except subprocess.CalledProcessError as e:
        print(f"[XATO] Migratsiyada xatolik: {e}")
        sys.exit(1)

    # 2. Check if database already has categories or products - avoid clobbering active data
    # unless '--force' is provided
    force_restore = '--force' in sys.argv
    if not force_restore:
        try:
            check_cmd = [
                sys.executable,
                os.path.join(backend_dir, "manage.py"),
                "shell",
                "-c",
                "from apps.products.models import Product, Category; import sys; sys.exit(42 if (Product.objects.count() > 0 or Category.objects.count() > 0) else 0)"
            ]
            res = subprocess.run(check_cmd, cwd=backend_dir)
            if res.returncode == 42:
                print("\n[HIMOYA] Baza bo'sh emas (ma'lumotlar allaqachon mavjud).")
                print("[HIMOYA] Joriy ma'lumotlar saqlab qolindi. Agar majburan tiklamoqchi bo'lsangiz: python restore_database.py --force")
                return
        except Exception as e:
            print(f"[OGOHLANTIRISH] Baza tekshirishda ogohlantirish: {e}")

    # 3. Prefer live_backup.json (contains freshest products and live orders)
    if os.path.exists(live_backup_file):
        try:
            import_from_live_backup(live_backup_file, backend_dir)
            return
        except Exception as e:
            print(f"[OGOHLANTIRISH] live_backup.json orqali tiklashda xatolik: {e}")
            print("[INFO] Zaxira 'backup_data.json' orqali urinib ko'rilmoqda...")

    # 4. Fallback to loaddata with backup_data.json
    if os.path.exists(legacy_backup_file):
        print("\n2. Zaxira fayldan ma'lumotlarni yuklash (loaddata)...")
        try:
            subprocess.run(
                [sys.executable, "-Xutf8", os.path.join(backend_dir, "manage.py"), "loaddata", legacy_backup_file],
                cwd=backend_dir,
                check=True
            )
            print("\n[MUVAFFAQIN] Dastlabki ma'lumotlar muvaffaqiyatli yuklandi!")
        except subprocess.CalledProcessError as e:
            print(f"[XATO] Ma'lumotlarni yuklashda xatolik: {e}")
            sys.exit(1)
    else:
        print("[OGOHLANTIRISH] Hech qanday zaxira fayli topilmadi.")

if __name__ == '__main__':
    run_restore()
