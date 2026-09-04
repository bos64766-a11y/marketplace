from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'icon', 'order', 'products_count')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

    def products_count(self, obj):
        return obj.products.count()
    products_count.short_description = 'Tovarlar soni'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'price', 'in_stock', 'is_popular', 'is_new')
    list_filter = ('category', 'in_stock', 'is_popular', 'is_new', 'brand')
    search_fields = ('name', 'sku', 'brand', 'description')
    inlines = [ProductImageInline]
    prepopulated_fields = {'slug': ('name',)}
