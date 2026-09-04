import os
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import SiteSettings, Banner
from .serializers import SiteSettingsSerializer, BannerSerializer


class SiteSettingsView(APIView):
    def get(self, request):
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
        file_obj = request.FILES.get('image') or request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'Hech qanday rasm fayli tanlanmadi'}, status=status.HTTP_400_BAD_REQUEST)

        # Check extension
        ext = os.path.splitext(file_obj.name)[1].lower()
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']
        if ext not in allowed_extensions:
            return Response(
                {'error': f'Faqat quyidagi formatdagi rasmlar qabul qilinadi: {", ".join(allowed_extensions)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure media/banners directory exists
        banners_dir = os.path.join(settings.MEDIA_ROOT, 'banners')
        os.makedirs(banners_dir, exist_ok=True)

        filename = f"banner_{uuid.uuid4().hex[:10]}{ext}"
        filepath = os.path.join(banners_dir, filename)

        with open(filepath, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        file_url = f"{settings.MEDIA_URL}banners/{filename}"
        return Response({
            'url': file_url,
            'filename': filename,
            'original_name': file_obj.name,
            'size': file_obj.size,
        }, status=status.HTTP_201_CREATED)
