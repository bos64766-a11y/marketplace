from django.urls import path
from .views import (
    SiteSettingsView,
    BannerListCreateView,
    BannerDetailView,
    FileUploadView,
    ShowcaseSectionListCreateView,
    ShowcaseSectionDetailView,
    PartnerListCreateView,
    PartnerDetailView,
    HealthCheckView,
    AdminInitView,
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('admin-init/', AdminInitView.as_view(), name='admin-init'),
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('banners/', BannerListCreateView.as_view(), name='banner-list-create'),
    path('banners/<int:pk>/', BannerDetailView.as_view(), name='banner-detail'),
    path('showcase-sections/', ShowcaseSectionListCreateView.as_view(), name='showcase-section-list-create'),
    path('showcase-sections/<int:pk>/', ShowcaseSectionDetailView.as_view(), name='showcase-section-detail'),
    path('partners/', PartnerListCreateView.as_view(), name='partner-list-create'),
    path('partners/<int:pk>/', PartnerDetailView.as_view(), name='partner-detail'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
]
