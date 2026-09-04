from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'slug', 'name', 'icon', 'image', 'description', 'count']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_main', 'order']


class ProductSerializer(serializers.ModelSerializer):
    # Frontend camelCase compatibility
    categoryId = serializers.CharField(source='category.id', read_only=True)
    categoryName = serializers.CharField(source='category.name', read_only=True)
    oldPrice = serializers.FloatField(source='old_price', allow_null=True, required=False)
    inStock = serializers.BooleanField(source='in_stock', default=True)
    minOrder = serializers.IntegerField(source='min_order', default=1)
    reviewsCount = serializers.IntegerField(source='reviews_count', default=0)
    isPopular = serializers.BooleanField(source='is_popular', default=False)
    isNew = serializers.BooleanField(source='is_new', default=False)
    images = serializers.SerializerMethodField()
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, required=False
    )
    # Allow writing category by ID
    category_id = serializers.CharField(write_only=True, required=False)
    images_list = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'name',
            'category',
            'category_id',
            'categoryId',
            'categoryName',
            'price',
            'oldPrice',
            'inStock',
            'brand',
            'sku',
            'unit',
            'minOrder',
            'tag',
            'rating',
            'reviewsCount',
            'description',
            'features',
            'isPopular',
            'isNew',
            'images',
            'images_list',
        ]
        extra_kwargs = {
            'id': {'required': False},
            'slug': {'required': False},
        }

    def get_images(self, obj):
        urls = [img.image_url for img in obj.product_images.all()]
        if not urls:
            return ['https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80']
        return urls

    def create(self, validated_data):
        images_data = validated_data.pop('images_list', [])
        cat_id = validated_data.pop('category_id', None)
        if cat_id and not validated_data.get('category'):
            try:
                validated_data['category'] = Category.objects.get(id=cat_id)
            except Category.DoesNotExist:
                # fallback
                cat = Category.objects.first()
                if cat:
                    validated_data['category'] = cat

        product = super().create(validated_data)

        if images_data:
            for idx, url in enumerate(images_data):
                ProductImage.objects.create(
                    product=product, image_url=url, is_main=(idx == 0), order=idx
                )
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images_list', None)
        cat_id = validated_data.pop('category_id', None)
        if cat_id:
            try:
                instance.category = Category.objects.get(id=cat_id)
            except Category.DoesNotExist:
                pass

        product = super().update(instance, validated_data)

        if images_data is not None:
            product.product_images.all().delete()
            for idx, url in enumerate(images_data):
                ProductImage.objects.create(
                    product=product, image_url=url, is_main=(idx == 0), order=idx
                )
        return product
