from django.urls import path
from .views import (
    SiteSettingsView,
    BannerListCreateView,
    BannerDetailView,
    FileUploadView,
    ShowcaseSectionListCreateView,
    ShowcaseSectionDetailView,
)

urlpatterns = [
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('banners/', BannerListCreateView.as_view(), name='banner-list-create'),
    path('banners/<int:pk>/', BannerDetailView.as_view(), name='banner-detail'),
    path('showcase-sections/', ShowcaseSectionListCreateView.as_view(), name='showcase-section-list-create'),
    path('showcase-sections/<int:pk>/', ShowcaseSectionDetailView.as_view(), name='showcase-section-detail'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
]
