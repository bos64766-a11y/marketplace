from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_object(self):
        # Allow lookup by slug or id
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_val = self.kwargs.get(lookup_url_kwarg)
        try:
            return Category.objects.get(Q(slug=lookup_val) | Q(id=lookup_val))
        except Category.DoesNotExist:
            return super().get_object()


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category').prefetch_related('product_images')
    serializer_class = ProductSerializer
    lookup_field = 'id'

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_val = self.kwargs.get(lookup_url_kwarg)
        try:
            return Product.objects.get(Q(id=lookup_val) | Q(slug=lookup_val))
        except Product.DoesNotExist:
            return super().get_object()

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        # Category filter
        category = params.get('category') or params.get('categoryId')
        if category and category != 'all':
            qs = qs.filter(Q(category__slug=category) | Q(category__id=category))

        # Search query
        search = params.get('q') or params.get('search')
        if search:
            q = search.strip()
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(brand__icontains=q)
                | Q(sku__icontains=q)
                | Q(category__name__icontains=q)
                | Q(description__icontains=q)
            )

        # In stock
        in_stock = params.get('inStock') or params.get('in_stock')
        if in_stock in ['true', '1']:
            qs = qs.filter(in_stock=True)

        # Brand
        brand = params.get('brand')
        if brand and brand != 'all':
            qs = qs.filter(brand=brand)

        # Price range
        min_price = params.get('min_price')
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = params.get('max_price')
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Sorting / Ordering
        sort = params.get('sortBy') or params.get('ordering')
        if sort == 'price-asc':
            qs = qs.order_by('price')
        elif sort == 'price-desc':
            qs = qs.order_by('-price')
        elif sort == 'newest':
            qs = qs.order_by('-is_new', '-created_at')
        elif sort == 'popular':
            qs = qs.order_by('-is_popular', '-reviews_count')

        return qs

    @action(detail=True, methods=['post'], url_path='toggle-stock')
    def toggle_stock(self, request, id=None):
        product = self.get_object()
        product.in_stock = not product.in_stock
        product.save(update_fields=['in_stock', 'updated_at'])
        return Response({
            'id': product.id,
            'name': product.name,
            'inStock': product.in_stock,
            'message': f"Ombor holati '{'Mavjud' if product.in_stock else 'Tugagan'}' ga o‘zgartirildi"
        })
