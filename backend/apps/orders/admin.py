from django.contrib import admin
from .models import CustomerContact, RequestOrder, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(CustomerContact)
class CustomerContactAdmin(admin.ModelAdmin):
    list_display = ('phone', 'name', 'company', 'inn', 'orders_count', 'updated_at')
    search_fields = ('phone', 'name', 'company', 'inn')


@admin.register(RequestOrder)
class RequestOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_phone', 'customer_company', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'customer_name', 'customer_phone', 'customer_company', 'comment')
    inlines = [OrderItemInline]
