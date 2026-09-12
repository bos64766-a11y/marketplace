from django.test import TestCase
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
    def test_banner_crud_api(self):
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

        # Get list
        list_res = self.client.get('/api/banners/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertTrue(any(b['id'] == banner_id for b in list_res.data))

        # Delete banner
        del_res = self.client.delete(f'/api/banners/{banner_id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

    def test_showcase_sections_api(self):
        create_res = self.client.post('/api/showcase-sections/', {
            'title': 'Restoranlar uchun',
            'subtitle': 'HoReCa',
            'productIds': ['snb-001', 'snb-002'],
            'order': 1,
            'isActive': True
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        sec_id = create_res.data['id']

        list_res = self.client.get('/api/showcase-sections/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)

        del_res = self.client.delete(f'/api/showcase-sections/{sec_id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

    def test_partners_api(self):
        create_res = self.client.post('/api/partners/', {
            'name': 'Hamkor Korxona',
            'logo': 'https://example.com/logo.png',
            'category': 'Distributor'
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        part_id = create_res.data['id']

        del_res = self.client.delete(f'/api/partners/{part_id}/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
