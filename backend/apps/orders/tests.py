from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from apps.products.models import Category, Product
from apps.orders.models import RequestOrder, CustomerContact


class OrderAPITest(APITestCase):
    def setUp(self):
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
        res = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        order_id = res.data['id']

        # Verify customer created
        customer = CustomerContact.objects.filter(phone='+998 90 123 45 67').first()
        self.assertIsNotNone(customer)
        self.assertEqual(customer.name, 'Ali Valiyev')

        # Verify status update action
        patch_res = self.client.patch(f'/api/orders/{order_id}/status/', {'status': 'Tasdiqlangan'}, format='json')
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data['status'], 'Tasdiqlangan')

    def test_customer_lookup_api(self):
        CustomerContact.objects.create(
            phone='+998 93 999 88 77',
            name='Nodirbek',
            company='Texno Ltd',
            inn='987654321'
        )
        res = self.client.get('/api/customer/lookup/?phone=%2B998%2093%20999%2088%2077')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['found'])
        self.assertEqual(res.data['customer']['name'], 'Nodirbek')
