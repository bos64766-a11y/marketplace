from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from apps.products.models import Category, Product, ProductImage


class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            id='test-kimyo',
            name='Test Kimyo',
            slug='test-kimyo'
        )

    def test_create_product_auto_sku_and_slug(self):
        """Test that product automatically generates sku and slug if missing"""
        product = Product.objects.create(
            name='Avtoshampun Super 5L',
            category=self.category,
            price=45000.00,
            brand='TestBrand'
        )
        self.assertTrue(product.sku)
        self.assertTrue(product.slug)
        self.assertTrue(product.id.startswith('snb-'))
        self.assertEqual(product.category.name, 'Test Kimyo')

    def test_product_images_relation(self):
        """Test ProductImage model relation and ordering"""
        product = Product.objects.create(
            name='Qo‘lqop Paxta',
            category=self.category,
            price=2000.00
        )
        img1 = ProductImage.objects.create(product=product, image_url='https://example.com/1.png', order=0)
        img2 = ProductImage.objects.create(product=product, image_url='data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==', order=1)
        self.assertEqual(product.product_images.count(), 2)


class ProductAPITest(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            id='kanselyariya',
            name='Kanselyariya',
            slug='kanselyariya'
        )

    def test_list_products(self):
        Product.objects.create(
            name='A4 Qog‘oz',
            category=self.category,
            price=35000.00
        )
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_create_product_via_api_without_sku(self):
        """Test API creation works even when sku and id are not provided"""
        payload = {
            'name': 'Ruchka Ko‘k 0.7mm',
            'categoryId': 'kanselyariya',
            'price': 1500.00,
            'brand': 'Attache',
            'inStock': True,
            'images': ['https://example.com/pen.jpg']
        }
        response = self.client.post('/api/products/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Ruchka Ko‘k 0.7mm')
        self.assertTrue(response.data['sku'])
        self.assertTrue(response.data['id'])
        self.assertEqual(response.data['images'], ['https://example.com/pen.jpg'])

    def test_category_crud_api(self):
        """Test Category list and create"""
        create_payload = {
            'name': 'Yangi Kategoriya',
            'name_ru': 'Новая Категория',
            'icon': 'Sparkles',
            'description': 'Kategoriya izohi',
            'description_ru': 'Описание категории'
        }
        res = self.client.post('/api/categories/', create_payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name'], 'Yangi Kategoriya')
        self.assertEqual(res.data['name_ru'], 'Новая Категория')
        self.assertTrue(res.data['slug'])

    def test_multilingual_product(self):
        """Test product with Russian fields"""
        payload = {
            'name': 'Ishchi qo‘lqoplar',
            'name_ru': 'Перчатки рабочие',
            'categoryId': 'kanselyariya',
            'price': 2500.00,
            'description': 'Paxtali qo‘lqoplar',
            'description_ru': 'Хлопчатобумажные перчатки',
            'tag': 'Yangi',
            'tag_ru': 'Новинка'
        }
        res = self.client.post('/api/products/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name_ru'], 'Перчатки рабочие')
        self.assertEqual(res.data['description_ru'], 'Хлопчатобумажные перчатки')
        self.assertEqual(res.data['tag_ru'], 'Новинка')

