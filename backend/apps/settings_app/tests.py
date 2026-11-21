from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from apps.settings_app.models import Banner, ShowcaseSection, Partner


class SettingsModelsTest(TestCase):
    def test_banner_supports_large_image_payload(self):
        """Test Banner can store long image strings (base64 DataURLs) without CharField truncation error"""
        long_data_url = 'data:image/png;base64,' + ('A' * 10000)
        banner = Banner.objects.create(
            title='Katta Banner',
            image=long_data_url,
            order=1,
            is_active=True
        )
        self.assertEqual(len(banner.image), len(long_data_url))
        self.assertEqual(banner.title, 'Katta Banner')

    def test_showcase_section_model(self):
        section = ShowcaseSection.objects.create(
            title='Avtomoykalar uchun',
            subtitle='Professional avtokimyo vositalari',
            product_ids=['snb-grass-foam', 'snb-grass-shampoo'],
            order=1
        )
        self.assertEqual(section.product_ids, ['snb-grass-foam', 'snb-grass-shampoo'])

    def test_partner_supports_large_logo(self):
        long_logo = 'data:image/svg+xml;base64,' + ('B' * 5000)
        partner = Partner.objects.create(
            name='Katta Hamkor',
            logo=long_logo,
            category='Ishlab chiqaruvchi'
        )
        self.assertEqual(len(partner.logo), len(long_logo))


class SettingsAPITest(APITestCase):
    def setUp(self):
        self.admin, _ = User.objects.get_or_create(
            username='admin_test_settings',
            defaults={'email': 'admin_settings@test.com', 'is_staff': True, 'is_superuser': True}
        )
        self.admin.set_password('admin123!@')
        self.admin.is_staff = True
        self.admin.save()

    def test_auth_login_and_verify(self):
        # 1. Invalid login
        bad_res = self.client.post('/api/auth/login/', {'username': 'admin_test_settings', 'password': 'wrongpassword'}, format='json')
        self.assertEqual(bad_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # 2. Valid login
        good_res = self.client.post('/api/auth/login/', {'username': 'admin_test_settings', 'password': 'admin123!@'}, format='json')
        self.assertEqual(good_res.status_code, status.HTTP_200_OK)
        token = good_res.data['token']
        self.assertTrue(token)

        # 3. Verify token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        verify_res = self.client.get('/api/auth/verify/')
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)
        self.assertTrue(verify_res.data['valid'])

    def test_banner_crud_api(self):
        # Unauthenticated cannot create
        unauth_res = self.client.post('/api/banners/', {'title': 'No auth'}, format='json')
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated admin can create
        self.client.force_authenticate(user=self.admin)
        long_image = 'data:image/jpeg;base64,' + ('C' * 2000)
        create_res = self.client.post('/api/banners/', {
            'title': 'API Banner',
            'image': long_image,
            'btnLink': '/catalog',
            'order': 1,
            'isActive': True
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        banner_id = create_res.data['id']

        # Public get
        self.client.logout()
        get_res = self.client.get(f'/api/banners/{banner_id}/')
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)

    def test_showcase_sections_api(self):
        self.client.force_authenticate(user=self.admin)
        create_res = self.client.post('/api/showcase-sections/', {
            'title': 'Yangi bo‘lim',
            'subtitle': 'Yangi mahsulotlar to‘plami',
            'productIds': ['snb-p1', 'snb-p2'],
            'order': 10,
            'isActive': True
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)

    def test_partners_api(self):
        self.client.force_authenticate(user=self.admin)
        create_res = self.client.post('/api/partners/', {
            'name': 'Yangi Hamkor',
            'logo': 'data:image/png;base64,1234',
            'category': 'Ishlab chiqaruvchi',
            'order': 1
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
