from rest_framework import serializers
from .models import CustomerContact, RequestOrder, OrderItem
from apps.products.models import Product
from apps.products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    productId = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'productId',
            'product_name',
            'product_sku',
            'product_image',
            'price',
            'quantity',
            'total_price',
        ]

    def get_product(self, obj):
        if obj.product:
            return ProductSerializer(obj.product).data
        return {
            'id': f"archived-{obj.id}",
            'name': obj.product_name,
            'sku': obj.product_sku,
            'price': float(obj.price),
            'images': [obj.product_image or 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&auto=format&fit=crop&q=80'],
            'unit': 'dona',
            'inStock': True,
        }


class CustomerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerContact
        fields = ['phone', 'name', 'company', 'inn', 'email', 'orders_count']


class RequestOrderSerializer(serializers.ModelSerializer):
    totalAmount = serializers.FloatField(source='total_amount', required=False)
    date = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()

    # Write-only incoming payload fields
    contact_data = serializers.DictField(write_only=True, required=False)
    items_data = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = RequestOrder
        fields = [
            'id',
            'date',
            'items',
            'totalAmount',
            'status',
            'contact',
            'contact_data',
            'items_data',
            'created_at',
        ]
        extra_kwargs = {
            'id': {'required': False},
            'status': {'required': False},
        }

    def get_date(self, obj):
        return obj.created_at.strftime('%d.%m.%Y')

    def get_contact(self, obj):
        return {
            'name': obj.customer_name,
            'phone': obj.customer_phone,
            'company': obj.customer_company,
            'inn': obj.customer_inn,
            'comment': obj.comment,
        }

    def get_items(self, obj):
        result = []
        for item in obj.items.all():
            if item.product:
                prod_data = ProductSerializer(item.product).data
            else:
                prod_data = {
                    'id': f"item-{item.id}",
                    'name': item.product_name,
                    'sku': item.product_sku,
                    'price': float(item.price),
                    'images': [item.product_image] if item.product_image else [],
                    'unit': 'dona',
                    'inStock': True,
                }
            result.append({
                'product': prod_data,
                'quantity': item.quantity,
            })
        return result

    def create(self, validated_data):
        contact_info = self.initial_data.get('contact', {}) or validated_data.pop('contact_data', {})
        items_payload = self.initial_data.get('items', []) or validated_data.pop('items_data', [])
        total_amt = validated_data.get('total_amount', 0)

        customer_name = contact_info.get('name', 'B2B Mijoz')
        customer_phone = contact_info.get('phone', '')
        customer_company = contact_info.get('company', '')
        customer_inn = contact_info.get('inn', '')
        comment = contact_info.get('comment', '')

        order = RequestOrder.objects.create(
            customer_name=customer_name,
            customer_phone=customer_phone,
            customer_company=customer_company,
            customer_inn=customer_inn,
            comment=comment,
            total_amount=total_amt or 0,
            status='Ko‘rib chiqilmoqda',
        )

        calc_total = 0
        for it in items_payload:
            prod_info = it.get('product', {})
            prod_id = prod_info.get('id')
            qty = int(it.get('quantity', 1))
            prod_obj = None

            if prod_id:
                prod_obj = Product.objects.filter(id=prod_id).first()

            if prod_obj:
                p_name = prod_obj.name
                p_sku = prod_obj.sku
                p_img = prod_obj.product_images.first().image_url if prod_obj.product_images.exists() else ''
                p_price = prod_obj.price
            else:
                p_name = prod_info.get('name', 'B2B Tovar')
                p_sku = prod_info.get('sku', '')
                imgs = prod_info.get('images', [])
                p_img = imgs[0] if imgs else ''
                p_price = float(prod_info.get('price', 0))

            calc_total += float(p_price) * qty
            OrderItem.objects.create(
                order=order,
                product=prod_obj,
                product_name=p_name,
                product_sku=p_sku,
                product_image=p_img,
                price=p_price,
                quantity=qty,
            )

        if not total_amt and calc_total > 0:
            order.total_amount = calc_total
            order.save(update_fields=['total_amount'])

        return order
