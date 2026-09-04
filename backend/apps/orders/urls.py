from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CustomerLookupView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('customer/lookup/', CustomerLookupView.as_view(), name='customer-lookup'),
    path('', include(router.urls)),
]
