import os
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import SiteSettings, Banner, ShowcaseSection, Partner
from .serializers import SiteSettingsSerializer, BannerSerializer, ShowcaseSectionSerializer, PartnerSerializer


class SiteSettingsView(APIView):
    def get(self, request):
        if request.query_params.get('sync_admin') == '1':
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                admin_user, _ = User.objects.get_or_create(
                    username='admin',
                    defaults={'is_superuser': True, 'is_staff': True, 'email': 'admin@snabtash.uz'}
                )
                admin_user.set_password('admin123!@')
                admin_user.is_superuser = True
                admin_user.is_staff = True
                admin_user.is_active = True
                admin_user.save()
            except Exception:
                pass

        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


DEFAULT_BANNERS = [
    {
        'badge': 'KORXONALAR UCHUN',
        'title': 'Kompleks ta’minot yechimi',
        'description': 'Biz sizning biznesingizga kerakli barcha mahsulotlarni bir joyda jamlaymiz va vaqtingizni tejaymiz.',
        'btn_text': 'Katalogni ko‘rish',
        'btn_link': '/catalog',
        'image': '/hero-supply-pack.jpg',
        'image_alt': 'Kompleks taʼminot yechimi',
        'order': 1,
        'is_active': True,
    },
    {
        'badge': 'TEZKOR VA ISHONCHLI',
        'title': 'Professional klining va kimyo',
        'description': 'SanPiN talablariga mos klining kimyolari, xo‘jalik inventarlari va tozalash vositalari to‘g‘ridan-to‘g‘ri ombordan.',
        'btn_text': 'Katalogni ko‘rish',
        'btn_link': '/catalog/maishiy-kimyo',
        'image': '/hero-supply-pack.jpg',
        'image_alt': 'Professional klining va tozalash',
        'order': 2,
        'is_active': True,
    },
    {
        'badge': 'ISHCHI XAVFSIZLIGI',
        'title': 'Himoya vositalari va qo‘lqoplar',
        'description': 'Ishlab chiqarish va omborlar uchun barcha turdagi sertifikatlangan ishchi qo‘lqoplar va himoya anjomlari.',
        'btn_text': 'Katalogni ko‘rish',
        'btn_link': '/catalog/himoya-vositalari',
        'image': '/hero-supply-pack.jpg',
        'image_alt': 'Himoya vositalari va qo‘lqoplar',
        'order': 3,
        'is_active': True,
    },
    {
        'badge': '100% RASMIY SHARTNOMA',
        'title': 'QQS bilan Didox e-faktura',
        'description': 'Barcha korporativ mijozlar uchun qonuniy shartnoma, hisob-faktura va Toshkent bo‘yicha bepul yetkazish.',
        'btn_text': 'Zayavka qoldirish',
        'btn_link': '/request',
        'image': '/hero-supply-pack.jpg',
        'image_alt': '100% Rasmiy B2B taʼminot',
        'order': 4,
        'is_active': True,
    },
]


class BannerListCreateView(APIView):
    def get(self, request):
        # Allow query param for active only: ?active=true
        active_only = request.query_params.get('active', '').lower() in ['true', '1']
        qs = Banner.objects.all().order_by('order', 'id')
        if active_only:
            qs = qs.filter(is_active=True)

        serializer = BannerSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BannerSerializer(data=request.data)
        if serializer.is_valid():
            banner = serializer.save()
            return Response(BannerSerializer(banner).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BannerDetailView(APIView):
    def get(self, request, pk):
        banner = get_object_or_404(Banner, pk=pk)
        return Response(BannerSerializer(banner).data)

    def put(self, request, pk):
        try:
            banner = Banner.objects.get(pk=pk)
        except (Banner.DoesNotExist, ValueError):
            # Gracefully handle local/new banner ID by creating new record
            serializer = BannerSerializer(data=request.data)
            if serializer.is_valid():
                banner = serializer.save()
                return Response(BannerSerializer(banner).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = BannerSerializer(banner, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        try:
            banner = Banner.objects.get(pk=pk)
            banner.delete()
        except (Banner.DoesNotExist, ValueError):
            pass
        return Response({'message': 'Banner muvaffaqiyatli o‘chirildi'}, status=status.HTTP_204_NO_CONTENT)


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES.get('image') or request.FILES.get('file')
            if not file_obj:
                return Response({'error': 'Hech qanday rasm fayli tanlanmadi'}, status=status.HTTP_400_BAD_REQUEST)

            # Check extension (case-insensitive)
            ext = os.path.splitext(file_obj.name)[1].lower()
            allowed_extensions = [
                '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif',
                '.jfif', '.avif', '.heic', '.heif', '.bmp', '.tiff', '.ico'
            ]
            if ext not in allowed_extensions:
                return Response(
                    {'error': f'Faqat rasm formatidagi fayllar qabul qilinadi (JPG, PNG, WEBP, SVG, JFIF, AVIF)'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Determine upload subfolder
            upload_type = request.query_params.get('type') or 'uploads'
            subfolder = 'products' if 'product' in upload_type else ('banners' if 'banner' in upload_type else 'uploads')
            target_dir = os.path.join(settings.MEDIA_ROOT, subfolder)
            os.makedirs(target_dir, exist_ok=True)

            # Map jfif/heic to jpg or keep safe ext
            safe_ext = '.jpg' if ext in ['.jfif', '.heic', '.heif'] else ext
            filename = f"img_{uuid.uuid4().hex[:12]}{safe_ext}"
            filepath = os.path.join(target_dir, filename)

            with open(filepath, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)

            rel_url = f"{settings.MEDIA_URL}{subfolder}/{filename}"
            file_url = request.build_absolute_uri(rel_url)
            # Ensure HTTPS if requested over HTTPS or behind TLS termination proxy
            if request.is_secure() or request.headers.get('x-forwarded-proto') == 'https':
                file_url = file_url.replace('http://', 'https://')

            return Response({
                'url': file_url,
                'relative_url': rel_url,
                'filename': filename,
                'original_name': file_obj.name,
                'size': file_obj.size,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Faylni serverda saqlashda xatolik: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


DEFAULT_SHOWCASE_SECTIONS = [
    {
        'title': 'Ofislar uchun',
        'title_ru': 'Для офисов',
        'subtitle': 'Kantselyariya, gigiyena va ofis kundalik sarflov vositalari',
        'subtitle_ru': 'Канцелярия, гигиена и ежедневные расходные материалы для офиса',
        'link': '/catalog/kanselyariya',
        'product_ids': ['snb-012', 'snb-004', 'snb-001', 'snb-tellux-zz2-comfort', 'snb-tellux-z2-towels', 'snb-glade-aerosol-300'],
        'order': 1,
        'is_active': True,
    },
    {
        'title': 'Restoran va mehmonxonalar uchun',
        'title_ru': 'Для ресторанов и отелей',
        'subtitle': 'HoReCa professional tozalash, idish yuvish va SanPiN talablariga mos vositalar',
        'subtitle_ru': 'HoReCa профессиональная уборка, мытье посуды и средства по стандартам СанПиН',
        'link': '/catalog/maishiy-kimyo',
        'product_ids': ['snb-napkins-elma-33', 'snb-toilet-paper-mini-2ply', 'snb-toilet-paper-giant-roll', 'snb-grass-dos-toilet-block', 'snb-grass-steel-cleaner', 'snb-001'],
        'order': 2,
        'is_active': True,
    },
    {
        'title': 'Klining kompaniyalari uchun',
        'title_ru': 'Для клининговых компаний',
        'subtitle': 'Professional tozalash kimyolari, konsentratlar va mikrofibra inventarlari',
        'subtitle_ru': 'Профессиональная химия для клининга, концентраты и инвентарь из микрофибры',
        'link': '/catalog/maishiy-kimyo',
        'product_ids': ['snb-grass-antigraffiti', 'snb-vanish-carpet-gold', 'snb-grass-polyrole-matte', 'snb-vanish-oxi-500', 'snb-plastic-bucket', 'snb-gloves-latex-korea'],
        'order': 3,
        'is_active': True,
    },
    {
        'title': 'Zavod va fabrikalar uchun',
        'title_ru': 'Для заводов и фабрик',
        'subtitle': 'Individual himoya vositalari, ishchi qo‘lqoplar va sanoat tozalovchilari',
        'subtitle_ru': 'Средства индивидуальной защиты, рабочие перчатки и промышленный клининг',
        'link': '/catalog/himoya-vositalari',
        'product_ids': ['snb-gloves-orange', 'snb-gloves-insulated-300', 'snb-gloves-cotton-45g', 'snb-gloves-nitrile-coating', 'snb-gloves-latex-zebra', 'snb-plastic-barrel'],
        'order': 4,
        'is_active': True,
    },
    {
        'title': 'Avtosalon va avtoservislar uchun',
        'title_ru': 'Для автосалонов и автосервисов',
        'subtitle': 'Polirovka disklari, Polirovka pastalari, Gillar, Oyna tozalagichlar',
        'subtitle_ru': 'Полировальные диски, пасты, глина и средства для очистки стекол',
        'link': '/catalog',
        'product_ids': [
            'snb-ironoff-disk-tozalagichi-750-ml',
            'snb-motor-clean-dvigatel-tozalagichi-750-ml',
            'snb-glossy-glass-oyna-tozalagichi-750-ml',
            'snb-abrasiveprep-abraziv-oyna-tozalagichi-450-ml',
            'snb-125-mm-polirovka-disklari',
            'snb-universal-tozalagich-va-yogsizlantirgich-eraser',
            'snb-pulimax-profy-avtomobil-saloni-yuzalarini-kimyoviy-tozalash-vositasi-4l',
            'snb-lavr-qoplamalar-uchun-kopik-tozalagich-650-ml',
            'snb-plastik-uchun-tozalovchi-polirovka-vositasi',
            'snb-lavr-universal-silikon-moyi-1-l',
            'snb-aim-one-silikon-spreyi',
            'snb-dry-monster-mikrofibra-4040-sm',
            'snb-koch-chemie-h801-heavy-cut-abraziv-polirovka-pastasi-1-l',
            'snb-abraziv-polirovka-pastasi-1-l',
            'snb-koch-chemie-micro-cut-m302-fini-polirovka-pastasi-1-l',
            'snb-koch-chemie-kok-tozalovchi-polirovka-gili-200-g',
            'snb-chemprint-bron-plyonkasi-uchun-spirt-20-l',
            'snb-vintex-alumax-avtomobil-kuzovi-pastki-qismini-tozalash-uchun-kislotali-vosita',
            'snb-kwazar-venus-purkagichi-2-l',
            'snb-scholl-concepts-s2-black-abraziv-polirovka-pastasi-500-g',
            'snb-fini-abraziv-polirovka-pastasi-s40',
            'snb-3m-trizact-3000-abraziv-polirovka-diski-150-mm',
            'snb-junli-polirovka-diski',
            'snb-avtomobil-uchun-latta',
        ],
        'order': 5,
        'is_active': True,
    },
]


class ShowcaseSectionListCreateView(APIView):
    def get(self, request):
        if ShowcaseSection.objects.count() == 0:
            for item in DEFAULT_SHOWCASE_SECTIONS:
                ShowcaseSection.objects.create(**item)
        else:
            for item in DEFAULT_SHOWCASE_SECTIONS:
                sec = ShowcaseSection.objects.filter(title__iexact=item['title']).first()
                if sec:
                    changed = False
                    if not sec.title_ru and item.get('title_ru'):
                        sec.title_ru = item['title_ru']
                        changed = True
                    if not sec.subtitle_ru and item.get('subtitle_ru'):
                        sec.subtitle_ru = item['subtitle_ru']
                        changed = True
                    if changed:
                        sec.save(update_fields=['title_ru', 'subtitle_ru'])
                else:
                    ShowcaseSection.objects.create(**item)

        sections = ShowcaseSection.objects.all().order_by('order', 'id')
        active_only = request.query_params.get('active')
        if active_only == 'true':
            sections = sections.filter(is_active=True)
        serializer = ShowcaseSectionSerializer(sections, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ShowcaseSectionSerializer(data=request.data)
        if serializer.is_valid():
            section = serializer.save()
            if 'title_ru' in request.data:
                section.title_ru = request.data.get('title_ru', '') or ''
            if 'subtitle_ru' in request.data:
                section.subtitle_ru = request.data.get('subtitle_ru', '') or ''
            section.save(update_fields=['title_ru', 'subtitle_ru'])
            return Response(ShowcaseSectionSerializer(section).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShowcaseSectionDetailView(APIView):
    def get(self, request, pk):
        section = get_object_or_404(ShowcaseSection, pk=pk)
        serializer = ShowcaseSectionSerializer(section)
        return Response(serializer.data)

    def patch(self, request, pk):
        section = get_object_or_404(ShowcaseSection, pk=pk)
        if 'title_ru' in request.data:
            section.title_ru = request.data.get('title_ru', '') or ''
        if 'subtitle_ru' in request.data:
            section.subtitle_ru = request.data.get('subtitle_ru', '') or ''
        serializer = ShowcaseSectionSerializer(section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            section.refresh_from_db()
            return Response(ShowcaseSectionSerializer(section).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        return self.patch(request, pk)

    def delete(self, request, pk):
        try:
            section = ShowcaseSection.objects.get(pk=pk)
            section.delete()
        except (ShowcaseSection.DoesNotExist, ValueError):
            pass
        return Response({'message': 'Bo‘lim muvaffaqiyatli o‘chirildi'}, status=status.HTTP_204_NO_CONTENT)


DEFAULT_PARTNERS = [
    {'name': 'Pepsi', 'logo': '/partners/pepsi.png', 'category': 'Ichimliklar & Oziq-ovqat', 'order': 1},
    {'name': 'Coca-Cola', 'logo': '/partners/coca-cola.png', 'category': 'Xalqaro brend', 'order': 2},
    {'name': 'Artel Electronics', 'logo': '/partners/artel.png', 'category': 'Maishiy texnika', 'order': 3},
    {'name': 'BETOMAX', 'logo': '', 'category': 'Beton & Qurilish', 'order': 4},
    {'name': 'BINOKOR', 'logo': '', 'category': 'Temir-beton majmuasi', 'order': 5},
    {'name': 'AGROMIR', 'logo': '', 'category': 'Agro holding', 'order': 6},
    {'name': 'UZTELECOM', 'logo': '', 'category': 'Telekom & Aloqa', 'order': 7},
    {'name': 'Beta Plus', 'logo': '', 'category': 'Ishlab chiqarish', 'order': 8},
]


class PartnerListCreateView(APIView):
    def get(self, request):
        if Partner.objects.count() == 0:
            for item in DEFAULT_PARTNERS:
                Partner.objects.create(**item)

        partners = Partner.objects.all().order_by('order', 'id')
        serializer = PartnerSerializer(partners, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PartnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartnerDetailView(APIView):
    def get(self, request, pk):
        partner = get_object_or_404(Partner, pk=pk)
        serializer = PartnerSerializer(partner)
        return Response(serializer.data)

    def patch(self, request, pk):
        partner = get_object_or_404(Partner, pk=pk)
        serializer = PartnerSerializer(partner, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        return self.patch(request, pk)

    def delete(self, request, pk):
        try:
            partner = Partner.objects.get(pk=pk)
            partner.delete()
        except (Partner.DoesNotExist, ValueError):
            pass
        return Response({'message': 'Hamkor muvaffaqiyatli o‘chirildi'}, status=status.HTTP_204_NO_CONTENT)


class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            'status': 'healthy',
            'version': '2.1.0',
            'deployment': 'snabtash-live'
        })


class AdminInitView(APIView):
    def get(self, request):
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            admin_user, _ = User.objects.get_or_create(
                username='admin',
                defaults={'is_superuser': True, 'is_staff': True, 'email': 'admin@snabtash.uz'}
            )
            admin_user.set_password('admin123!@')
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.is_active = True
            admin_user.save()
            return Response({
                'status': 'success',
                'username': 'admin',
                'updated': True,
                'message': 'Superuser admin paroli muvaffaqiyatli admin123!@ ga o‘rnatildi'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RestoreBackupView(APIView):
    """
    Accepts full backup JSON payload (from frontend export or live_backup.json)
    and saves/updates all Categories, Products, Images, ShowcaseSections,
    Banners, SiteSettings, and Partners directly in PostgreSQL database.
    """
    def post(self, request):
        return self._process_restore(request)

    def get(self, request):
        if request.query_params.get('seed') == '1':
            return self._process_restore(request, use_disk_fixtures=True)
        return Response({
            'status': 'ready',
            'message': 'Zaxirani server bazasiga tiklash uchun JSON bilan POST so‘rov yuboring.'
        })

    def _process_restore(self, request, use_disk_fixtures=False):
        import json
        from django.db import models
        from apps.products.models import Category, Product, ProductImage
        from apps.orders.models import RequestOrder, OrderItem
        from apps.settings_app.models import ShowcaseSection, Banner, SiteSettings, Partner

        payload = {}
        if use_disk_fixtures or request.query_params.get('seed') == '1':
            fixtures_path = os.path.join(settings.BASE_DIR, 'fixtures', 'live_backup.json')
            if os.path.exists(fixtures_path):
                with open(fixtures_path, 'r', encoding='utf-8') as f:
                    payload = json.load(f)
            else:
                return Response({'error': 'fixtures/live_backup.json fayli topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        else:
            payload = request.data

        if not payload or not isinstance(payload, dict):
            return Response({'error': 'Noto‘g‘ri ma‘lumot formati (JSON ob‘ekt kutilgan)'}, status=status.HTTP_400_BAD_REQUEST)

        root = payload.get('data', payload) if isinstance(payload.get('data'), dict) else payload

        restored_categories = 0
        restored_products = 0
        restored_sections = 0
        restored_banners = 0
        restored_partners = 0
        restored_orders = 0
        restored_settings = False

        # 1. Categories
        categories_data = root.get('categories', [])
        for c in categories_data:
            cat_id = str(c.get('id') or c.get('slug') or '').strip()
            if not cat_id:
                continue
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
                    'order': int(c.get('order', 0) or 0),
                }
            )
            restored_categories += 1

        # 2. Products
        products_data = root.get('products', [])
        default_cat = Category.objects.first()

        for p in products_data:
            prod_id = str(p.get('id') or '').strip()
            if not prod_id:
                continue

            cat_id = str(p.get('categoryId') or p.get('category_id') or p.get('category') or '').strip()
            cat_obj = None
            if cat_id:
                cat_obj = Category.objects.filter(models.Q(id=cat_id) | models.Q(slug=cat_id)).first()
            if not cat_obj:
                cat_obj = default_cat

            prod_slug = str(p.get('slug') or prod_id)
            prod_sku = str(p.get('sku') or f"SNB-{prod_id[-6:].upper()}")

            Product.objects.filter(slug=prod_slug).exclude(id=prod_id).update(slug=models.F('slug') + '-old-' + models.F('id'))
            Product.objects.filter(sku=prod_sku).exclude(id=prod_id).update(sku=models.F('sku') + '-old-' + models.F('id'))

            try:
                price_val = float(p.get('price', 0) or 0)
            except (ValueError, TypeError):
                price_val = 0.0

            old_price_val = None
            if p.get('oldPrice') or p.get('old_price'):
                try:
                    old_price_val = float(p.get('oldPrice') or p.get('old_price'))
                except (ValueError, TypeError):
                    old_price_val = None

            try:
                rating_val = float(p.get('rating', 5.0) or 5.0)
            except (ValueError, TypeError):
                rating_val = 5.0

            try:
                reviews_cnt = int(p.get('reviewsCount', p.get('reviews_count', 0)) or 0)
            except (ValueError, TypeError):
                reviews_cnt = 0

            try:
                min_ord = int(p.get('minOrder', p.get('min_order', 1)) or 1)
            except (ValueError, TypeError):
                min_ord = 1

            in_stock_val = p.get('inStock', p.get('in_stock', True))
            if isinstance(in_stock_val, str):
                in_stock_val = in_stock_val.lower() in ['true', '1', 'ha', 'bor']
            else:
                in_stock_val = bool(in_stock_val)

            prod_obj, _ = Product.objects.update_or_create(
                id=prod_id,
                defaults={
                    'slug': prod_slug,
                    'name': p.get('name', ''),
                    'name_ru': p.get('name_ru', '') or '',
                    'category': cat_obj,
                    'price': price_val,
                    'old_price': old_price_val,
                    'in_stock': in_stock_val,
                    'brand': p.get('brand', 'SNABTASH') or 'SNABTASH',
                    'sku': prod_sku,
                    'unit': p.get('unit', 'dona') or 'dona',
                    'min_order': min_ord,
                    'tag': p.get('tag', '') or '',
                    'tag_ru': p.get('tag_ru', '') or '',
                    'rating': rating_val,
                    'reviews_count': reviews_cnt,
                    'description': p.get('description', '') or '',
                    'description_ru': p.get('description_ru', '') or '',
                    'is_popular': bool(p.get('isPopular', p.get('is_popular', False))),
                    'is_new': bool(p.get('isNew', p.get('is_new', False))),
                }
            )

            # Images
            images = p.get('images', []) or p.get('images_list', [])
            if images and isinstance(images, list):
                prod_obj.product_images.all().delete()
                for idx, img_item in enumerate(images):
                    img_url = ''
                    if isinstance(img_item, dict):
                        img_url = img_item.get('image_url') or img_item.get('url') or ''
                    elif isinstance(img_item, str):
                        img_url = img_item.strip()
                    if img_url:
                        ProductImage.objects.create(
                            product=prod_obj,
                            image_url=img_url,
                            is_main=(idx == 0),
                            order=idx
                        )

            restored_products += 1

        # 3. Showcase Sections
        sections_data = root.get('showcase-sections') or root.get('showcaseSections', [])
        for s in sections_data:
            sec_id = s.get('id')
            if not sec_id:
                continue
            ShowcaseSection.objects.update_or_create(
                id=sec_id,
                defaults={
                    'title': s.get('title', ''),
                    'title_ru': s.get('title_ru', '') or '',
                    'subtitle': s.get('subtitle', '') or '',
                    'subtitle_ru': s.get('subtitle_ru', '') or '',
                    'badge': s.get('badge', '') or '',
                    'icon': s.get('icon', 'Building2') or 'Building2',
                    'link': s.get('link', '/catalog') or '/catalog',
                    'product_ids': s.get('productIds', []) or s.get('product_ids', []),
                    'order': int(s.get('order', 0) or 0),
                    'is_active': bool(s.get('isActive', s.get('is_active', True))),
                }
            )
            restored_sections += 1

        # 4. Banners
        banners_data = root.get('banners', [])
        for b in banners_data:
            ban_id = b.get('id')
            if not ban_id:
                continue
            Banner.objects.update_or_create(
                id=ban_id,
                defaults={
                    'title': b.get('title', ''),
                    'title_ru': b.get('title_ru', '') or '',
                    'badge': b.get('badge', '') or '',
                    'badge_ru': b.get('badge_ru', '') or '',
                    'description': b.get('description', '') or '',
                    'description_ru': b.get('description_ru', '') or '',
                    'btn_text': b.get('btnText') or b.get('btn_text', '') or '',
                    'btn_text_ru': b.get('btnText_ru') or b.get('btn_text_ru', '') or '',
                    'btn_link': b.get('btnLink') or b.get('btn_link', '/catalog') or '/catalog',
                    'image': b.get('image', '') or '',
                    'image_ru': b.get('image_ru', '') or '',
                    'image_alt': b.get('imageAlt') or b.get('image_alt', '') or '',
                    'image_alt_ru': b.get('imageAlt_ru') or b.get('image_alt_ru', '') or '',
                    'order': int(b.get('order', 0) or 0),
                    'is_active': bool(b.get('isActive', b.get('is_active', True))),
                }
            )
            restored_banners += 1

        # 5. Site Settings
        sett = root.get('settings') or root.get('siteSettings', {})
        if sett and isinstance(sett, dict) and (sett.get('companyName') or sett.get('company_name')):
            SiteSettings.objects.update_or_create(
                id=1,
                defaults={
                    'company_name': sett.get('companyName') or sett.get('company_name', 'SNABTASH'),
                    'phone': sett.get('phone', '') or '',
                    'email': sett.get('email', '') or '',
                    'address': sett.get('address', '') or '',
                    'address_ru': sett.get('address_ru', '') or '',
                    'telegram': sett.get('telegram', '') or '',
                    'working_hours': sett.get('workingHours') or sett.get('working_hours', '') or '',
                    'working_hours_ru': sett.get('workingHours_ru') or sett.get('working_hours_ru', '') or '',
                }
            )
            restored_settings = True

        # 6. Partners
        partners_data = root.get('partners', [])
        for part in partners_data:
            part_id = part.get('id')
            if not part_id:
                continue
            Partner.objects.update_or_create(
                id=part_id,
                defaults={
                    'name': part.get('name', ''),
                    'logo': part.get('logo', '') or '',
                    'order': int(part.get('order', 0) or 0),
                    'is_active': bool(part.get('isActive', True)),
                }
            )
            restored_partners += 1

        # 7. Orders / Requests (if provided)
        orders_data = root.get('orders') or root.get('requests', [])
        for o in orders_data:
            order_id = str(o.get('id') or '').strip()
            if not order_id:
                continue
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
            restored_orders += 1

        return Response({
            'success': True,
            'message': f"Serverga muvaffaqiyatli saqlandi: {restored_products} ta mahsulot, {restored_categories} ta kategoriya, {restored_sections} ta bo‘lim.",
            'counts': {
                'products': restored_products,
                'categories': restored_categories,
                'sections': restored_sections,
                'banners': restored_banners,
                'partners': restored_partners,
                'orders': restored_orders,
                'settings': restored_settings,
            }
        })


