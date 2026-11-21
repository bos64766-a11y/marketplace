import random
from django.db import models
from django.utils import timezone
from apps.products.models import Product


class CustomerContact(models.Model):
    phone = models.CharField(max_length=40, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, default='')
    inn = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    orders_count = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Mijoz'
        verbose_name_plural = 'Mijozlar'

    def __str__(self):
        return f"{self.name} ({self.phone})"


class RequestOrder(models.Model):
    STATUS_CHOICES = [
        ('Ko‘rib chiqilmoqda', 'Ko‘rib chiqilmoqda'),
        ('Tasdiqlangan', 'Tasdiqlangan'),
        ('Yetkazilmoqda', 'Yetkazilmoqda'),
        ('Bajarildi', 'Bajarildi'),
        ('Bekor qilingan', 'Bekor qilingan'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # e.g. '1042', '1043'
    customer = models.ForeignKey(
        CustomerContact, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders'
    )
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=50)
    customer_company = models.CharField(max_length=255, blank=True, default='')
    customer_inn = models.CharField(max_length=50, blank=True, default='')
    comment = models.TextField(blank=True, default='')
    total_amount = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    status = models.CharField(
        max_length=60, choices=STATUS_CHOICES, default='Ko‘rib chiqilmoqda', db_index=True
    )
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Zayavka'
        verbose_name_plural = 'Zayavkalar'

    def __str__(self):
        return f"Zayavka #{self.id} — {self.customer_name} ({self.total_amount} so‘m)"

    def save(self, *args, **kwargs):
        is_new = self._state.adding or not self.pk or not RequestOrder.objects.filter(pk=self.pk).exists()
        if not self.id:
            # Generate sequential 4-6 digit B2B order ID
            try:
                numeric_orders = RequestOrder.objects.filter(id__regex=r'^\d+$')
                max_id = 1048
                for o in numeric_orders.only('id'):
                    if o.id.isdigit():
                        num = int(o.id)
                        if num > max_id:
                            max_id = num
                self.id = str(max_id + 1)
            except Exception:
                self.id = str(int(timezone.now().timestamp()))[-6:]

        # Sync or create CustomerContact ONLY when new order is created
        if self.customer_phone and is_new:
            contact, created = CustomerContact.objects.get_or_create(
                phone=self.customer_phone,
                defaults={
                    'name': self.customer_name,
                    'company': self.customer_company,
                    'inn': self.customer_inn,
                    'orders_count': 1,
                },
            )
            if not created:
                contact.name = self.customer_name
                if self.customer_company:
                    contact.company = self.customer_company
                if self.customer_inn:
                    contact.inn = self.customer_inn
                contact.orders_count = (contact.orders_count or 0) + 1
                contact.save()
            self.customer = contact
        elif self.customer_phone and not self.customer:
            contact = CustomerContact.objects.filter(phone=self.customer_phone).first()
            if contact:
                self.customer = contact

        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(RequestOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255)
    product_sku = models.CharField(max_length=100, blank=True, default='')
    product_image = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=14, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        verbose_name = 'Zayavka tovari'
        verbose_name_plural = 'Zayavka tovarlari'

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    def save(self, *args, **kwargs):
        self.total_price = self.price * self.quantity
        super().save(*args, **kwargs)
