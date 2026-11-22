from django.urls import path
from .views import (
    SiteSettingsView,
    TelegramTestView,
    BannerListCreateView,
    BannerDetailView,
    FileUploadView,
    ShowcaseSectionListCreateView,
    ShowcaseSectionDetailView,
    PartnerListCreateView,
    PartnerDetailView,
    HealthCheckView,
    RestoreBackupView,
)
from .auth_views import AdminLoginView, AdminVerifyView, AdminLogoutView

urlpatterns = [
    # Auth endpoints
    path('auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/verify/', AdminVerifyView.as_view(), name='admin-verify'),
    path('auth/logout/', AdminLogoutView.as_view(), name='admin-logout'),

    # Site and content
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('settings/test-telegram/', TelegramTestView.as_view(), name='test-telegram'),
    path('settings/restore-backup/', RestoreBackupView.as_view(), name='restore-backup'),
    path('restore/', RestoreBackupView.as_view(), name='restore-backup-direct'),
    path('banners/', BannerListCreateView.as_view(), name='banner-list-create'),
    path('banners/<int:pk>/', BannerDetailView.as_view(), name='banner-detail'),
    path('showcase-sections/', ShowcaseSectionListCreateView.as_view(), name='showcase-section-list-create'),
    path('showcase-sections/<int:pk>/', ShowcaseSectionDetailView.as_view(), name='showcase-section-detail'),
    path('partners/', PartnerListCreateView.as_view(), name='partner-list-create'),
    path('partners/<int:pk>/', PartnerDetailView.as_view(), name='partner-detail'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
]
