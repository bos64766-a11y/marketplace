from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from apps.products.models import Category, Product
from apps.orders.models import RequestOrder


class DashboardAnalyticsAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username='admin_analytics_test',
            email='admin_analytics@test.com',
            password='secretpassword'
        )
        self.category = Category.objects.create(id='analytics-cat', name='Cat', slug='cat')
        self.product = Product.objects.create(name='Test Prod', category=self.category, price=50000.00, in_stock=True)

        # Create orders with different statuses
        RequestOrder.objects.create(
            id='1001',
            customer_name='Bekzod',
            customer_phone='+998901112233',
            status='Ko‘rib chiqilmoqda',
            total_amount=50000.00
        )
        RequestOrder.objects.create(
            id='1002',
            customer_name='Sherzod',
            customer_phone='+998904445566',
            status='Bajarildi',
            total_amount=100000.00
        )

    def test_anonymous_access_forbidden(self):
        res = self.client.get('/api/analytics/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_dashboard_metrics(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.get('/api/analytics/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data

        kpi = data['kpi']
        self.assertEqual(kpi['totalProducts'], 1)
        self.assertEqual(kpi['inStockProducts'], 1)
        self.assertEqual(kpi['totalOrders'], 2)
        # Verify pending count accurately matches model choice
        self.assertEqual(kpi['pendingOrders'], 1)
        self.assertEqual(kpi['completedOrders'], 1)
        self.assertEqual(kpi['totalRevenue'], 150000.00)
        self.assertEqual(data['statusCounts']['pending'], 1)
