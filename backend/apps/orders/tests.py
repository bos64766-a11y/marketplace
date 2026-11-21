from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from apps.products.models import Category, Product
from apps.orders.models import RequestOrder, CustomerContact


class OrderAPITest(APITestCase):
    def setUp(self):
        self.admin, _ = User.objects.get_or_create(
            username='admin_test_orders',
            defaults={'email': 'admin_orders@test.com', 'is_staff': True, 'is_superuser': True}
        )
        self.admin.set_password('adminpass')
        self.admin.is_staff = True
        self.admin.save()
        self.category = Category.objects.create(id='test-cat', name='Test Cat', slug='test-cat')
        self.product = Product.objects.create(
            name='Sinov Mahsulot',
            category=self.category,
            price=10000.00
        )

    def test_create_order_and_customer_auto_creation(self):
        payload = {
            'items': [
                {
                    'product': {
                        'id': self.product.id,
                        'name': self.product.name,
                        'price': float(self.product.price),
                        'unit': self.product.unit
                    },
                    'quantity': 3
                }
            ],
            'totalAmount': 30000.00,
            'contact': {
                'name': 'Ali Valiyev',
                'phone': '+998 90 123 45 67',
                'company': 'Ali MCHJ',
                'inn': '123456789',
                'comment': 'Tez yetkazilsin'
            }
        }
        # Anonymous customer can place an order
        res = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        order_id = res.data['id']

        # Verify customer created
        customer = CustomerContact.objects.filter(phone='+998 90 123 45 67').first()
        self.assertIsNotNone(customer)
        self.assertEqual(customer.name, 'Ali Valiyev')

        # Anonymous cannot change order status (returns 401)
        unauth_patch = self.client.patch(f'/api/orders/{order_id}/status/', {'status': 'Tasdiqlangan'}, format='json')
        self.assertEqual(unauth_patch.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated admin can change order status
        self.client.force_authenticate(user=self.admin)
        patch_res = self.client.patch(f'/api/orders/{order_id}/status/', {'status': 'Tasdiqlangan'}, format='json')
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data['status'], 'Tasdiqlangan')
