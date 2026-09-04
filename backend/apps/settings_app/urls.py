from django.urls import path
from .views import SiteSettingsView, BannerListCreateView, BannerDetailView, FileUploadView

urlpatterns = [
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('banners/', BannerListCreateView.as_view(), name='banner-list-create'),
    path('banners/<int:pk>/', BannerDetailView.as_view(), name='banner-detail'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
]
