from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    id = models.CharField(max_length=100, primary_key=True)  # e.g. 'avtokimyo', 'maishiy-kimyo'
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    name_ru = models.CharField(max_length=255, blank=True, default='')
    icon = models.CharField(max_length=100, default='Sparkles')
    image = models.TextField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    description_ru = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Kategoriya'
        verbose_name_plural = 'Kategoriyalar'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.id:
            self.id = self.slug
        super().save(*args, **kwargs)

    @property
    def count(self):
        return self.products.count()


class Product(models.Model):
    id = models.CharField(max_length=100, primary_key=True)  # e.g. 'snb-gloves-orange', 'snb-1048'
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    name_ru = models.CharField(max_length=255, blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=14, decimal_places=2)
    old_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    in_stock = models.BooleanField(default=True, db_index=True)
    brand = models.CharField(max_length=150, default='SNABTASH')
    sku = models.CharField(max_length=100, unique=True, db_index=True, blank=True)
    unit = models.CharField(max_length=50, default='dona')
    min_order = models.PositiveIntegerField(default=1)
    tag = models.CharField(max_length=100, blank=True, null=True)
    tag_ru = models.CharField(max_length=100, blank=True, default='')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    reviews_count = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, default='')
    description_ru = models.TextField(blank=True, default='')
    features = models.JSONField(default=list, blank=True)
    is_popular = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mahsulot'
        verbose_name_plural = 'Mahsulotlar'

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def save(self, *args, **kwargs):
        import uuid
        if not self.sku:
            self.sku = f"SNB-{uuid.uuid4().hex[:8].upper()}"
        if not self.slug:
            base_slug = slugify(self.name) or 'product'
            candidate = base_slug
            counter = 1
            while Product.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = candidate
        if not self.id:
            candidate_id = f"snb-{self.slug}"
            counter = 1
            while Product.objects.filter(id=candidate_id).exclude(pk=self.pk).exists():
                candidate_id = f"snb-{self.slug}-{counter}"
                counter += 1
            self.id = candidate_id
        super().save(*args, **kwargs)

    @property
    def category_id(self):
        return self.category.id

    @property
    def category_name(self):
        return self.category.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images')
    image_url = models.TextField()
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Image for {self.product.name}"
