from rest_framework import serializers
from .models import SiteSettings, Banner, ShowcaseSection, Partner


class SiteSettingsSerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(source='company_name', required=False)
    phone1 = serializers.CharField(source='phone_1', required=False)
    phone2 = serializers.CharField(source='phone_2', required=False)
    telegramBot = serializers.CharField(source='telegram_bot', required=False)
    telegramChannel = serializers.CharField(source='telegram_channel', required=False)
    workHours = serializers.CharField(source='work_hours', required=False)
    bankAccount = serializers.CharField(source='bank_account', required=False)
    bankName = serializers.CharField(source='bank_name', required=False)
    freeDeliveryThreshold = serializers.FloatField(source='free_delivery_threshold', required=False)
    deliveryCost = serializers.FloatField(source='delivery_cost', required=False)
    bannerHeadline = serializers.CharField(source='banner_headline', required=False)
    bannerSubtitle = serializers.CharField(source='banner_subtitle', required=False)
    bannerDiscountBadge = serializers.CharField(source='banner_discount_badge', required=False)

    class Meta:
        model = SiteSettings
        fields = [
            'companyName',
            'phone1',
            'phone2',
            'email',
            'telegramBot',
            'telegramChannel',
            'address',
            'workHours',
            'inn',
            'mfo',
            'bankAccount',
            'bankName',
            'freeDeliveryThreshold',
            'deliveryCost',
            'bannerHeadline',
            'bannerSubtitle',
            'bannerDiscountBadge',
        ]


class BannerSerializer(serializers.ModelSerializer):
    badge = serializers.CharField(required=False, allow_blank=True, default='')
    title = serializers.CharField(required=False, allow_blank=True, default='Banner')
    description = serializers.CharField(required=False, allow_blank=True, default='')
    btnText = serializers.CharField(source='btn_text', required=False, allow_blank=True, default='')
    btnLink = serializers.CharField(source='btn_link', required=False, allow_blank=True, default='/catalog')
    image = serializers.CharField(required=True)
    imageAlt = serializers.CharField(source='image_alt', required=False, allow_blank=True, default='')
    isActive = serializers.BooleanField(source='is_active', required=False, default=True)

    class Meta:
        model = Banner
        fields = [
            'id',
            'badge',
            'title',
            'description',
            'btnText',
            'btnLink',
            'image',
            'imageAlt',
            'order',
            'isActive',
            'created_at',
            'updated_at',
        ]


class ShowcaseSectionSerializer(serializers.ModelSerializer):
    title_ru = serializers.CharField(required=False, allow_blank=True, default='')
    subtitle_ru = serializers.CharField(required=False, allow_blank=True, default='')
    productIds = serializers.ListField(child=serializers.CharField(), source='product_ids', required=False)
    isActive = serializers.BooleanField(source='is_active', required=False)

    class Meta:
        model = ShowcaseSection
        fields = [
            'id',
            'title',
            'title_ru',
            'subtitle',
            'subtitle_ru',
            'badge',
            'icon',
            'link',
            'productIds',
            'order',
            'isActive',
        ]


class PartnerSerializer(serializers.ModelSerializer):
    logo = serializers.CharField(required=False, allow_blank=True, default='')
    category = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'logo',
            'category',
            'order',
            'created_at',
            'updated_at',
        ]

