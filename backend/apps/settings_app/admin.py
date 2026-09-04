from django.contrib import admin
from .models import SiteSettings, Banner


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'phone_1', 'phone_2', 'email', 'updated_at')


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'badge', 'btn_link', 'order', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'badge', 'description')
