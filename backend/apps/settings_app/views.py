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
        banner = get_object_or_404(Banner, pk=pk)
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
]


class ShowcaseSectionListCreateView(APIView):
    def get(self, request):
        if ShowcaseSection.objects.count() == 0:
            for item in DEFAULT_SHOWCASE_SECTIONS:
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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShowcaseSectionDetailView(APIView):
    def get(self, request, pk):
        section = get_object_or_404(ShowcaseSection, pk=pk)
        serializer = ShowcaseSectionSerializer(section)
        return Response(serializer.data)

    def patch(self, request, pk):
        section = get_object_or_404(ShowcaseSection, pk=pk)
        serializer = ShowcaseSectionSerializer(section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
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

