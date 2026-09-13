from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'slug', 'name', 'name_ru', 'icon', 'image', 'description', 'description_ru', 'count']
        extra_kwargs = {
            'id': {'required': False, 'allow_blank': True},
            'slug': {'required': False, 'allow_blank': True},
            'name_ru': {'required': False, 'allow_blank': True},
            'description_ru': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        from django.utils.text import slugify
        if not validated_data.get('slug'):
            base = slugify(validated_data.get('name', 'category')) or 'category'
            validated_data['slug'] = base
        if not validated_data.get('id'):
            validated_data['id'] = validated_data['slug']
        return super().create(validated_data)


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
    images = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, required=False
    )
    # Allow writing category by ID (both camelCase and snake_case)
    category_id = serializers.CharField(write_only=True, required=False)
    sku = serializers.CharField(required=False, allow_blank=True)
    name_ru = serializers.CharField(required=False, allow_blank=True)
    description_ru = serializers.CharField(required=False, allow_blank=True)
    tag_ru = serializers.CharField(required=False, allow_blank=True)
    images_list = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'name',
            'name_ru',
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
            'tag_ru',
            'rating',
            'reviewsCount',
            'description',
            'description_ru',
            'features',
            'isPopular',
            'isNew',
            'images',
            'images_list',
        ]
        extra_kwargs = {
            'id': {'required': False, 'allow_blank': True},
            'slug': {'required': False, 'allow_blank': True},
            'sku': {'required': False, 'allow_blank': True},
            'brand': {'required': False, 'allow_blank': True},
            'unit': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'description_ru': {'required': False, 'allow_blank': True},
            'tag': {'required': False, 'allow_blank': True},
            'tag_ru': {'required': False, 'allow_blank': True},
            'name_ru': {'required': False, 'allow_blank': True},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        urls = [img.image_url for img in instance.product_images.all()]
        if not urls:
            urls = ['https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80']
        ret['images'] = urls
        return ret

    def create(self, validated_data):
        import uuid
        from django.utils.text import slugify
        from django.db.models import Q

        images_data = validated_data.pop('images', None)
        if images_data is None:
            images_data = validated_data.pop('images_list', [])
        else:
            validated_data.pop('images_list', None)

        cat_id = validated_data.pop('category_id', None)
        if not cat_id and 'categoryId' in self.initial_data:
            cat_id = self.initial_data.get('categoryId')

        if cat_id and not validated_data.get('category'):
            try:
                validated_data['category'] = Category.objects.get(Q(id=cat_id) | Q(slug=cat_id))
            except Category.DoesNotExist:
                cat = Category.objects.first()
                if cat:
                    validated_data['category'] = cat
        elif not validated_data.get('category'):
            cat = Category.objects.first()
            if cat:
                validated_data['category'] = cat

        if not validated_data.get('brand'):
            validated_data['brand'] = 'SNABTASH'

        if not validated_data.get('unit'):
            validated_data['unit'] = 'dona'

        if not validated_data.get('sku'):
            validated_data['sku'] = f"SNB-{uuid.uuid4().hex[:8].upper()}"

        if not validated_data.get('slug'):
            base_slug = slugify(validated_data.get('name', 'product')) or 'product'
            validated_data['slug'] = f"{base_slug}-{uuid.uuid4().hex[:6]}"

        if not validated_data.get('id'):
            validated_data['id'] = f"snb-{validated_data['slug']}"

        product = super().create(validated_data)

        if images_data:
            for idx, url in enumerate(images_data):
                ProductImage.objects.create(
                    product=product, image_url=url, is_main=(idx == 0), order=idx
                )
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        if images_data is None:
            images_data = validated_data.pop('images_list', None)
        else:
            validated_data.pop('images_list', None)

        cat_id = validated_data.pop('category_id', None)
        if not cat_id and 'categoryId' in self.initial_data:
            cat_id = self.initial_data.get('categoryId')

        if cat_id:
            try:
                from django.db.models import Q
                instance.category = Category.objects.get(Q(id=cat_id) | Q(slug=cat_id))
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
