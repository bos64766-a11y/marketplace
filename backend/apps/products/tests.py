from django.test import TestCase
from django.contrib.auth.models import User
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
        self.admin, _ = User.objects.get_or_create(
            username='admin_test_products',
            defaults={'email': 'admin_prod@test.com', 'is_staff': True, 'is_superuser': True}
        )
        self.admin.set_password('adminpass')
        self.admin.is_staff = True
        self.admin.save()
        self.category = Category.objects.create(
            id='kanselyariya',
            name='Kanselyariya',
            slug='kanselyariya'
        )

    def test_list_products(self):
        Product.objects.create(
            name='A4 Qog‘oz',
            category=self.category,
            price=55000.00,
            sku='A4-100'
        )
        res = self.client.get('/api/products/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_create_product_via_api_without_sku(self):
        """Test API creation requires admin and works when sku/id not provided"""
        payload = {
            'name': 'Hojatxona qog‘ozi 12 dona',
            'category': 'kanselyariya',
            'price': 24000.00
        }
        # Anonymous cannot create
        unauth_res = self.client.post('/api/products/', payload, format='json')
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Admin can create
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/products/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['id'].startswith('snb-'))
        self.assertTrue(response.data['sku'])
        self.assertEqual(float(response.data['price']), 24000.00)

    def test_category_crud_api(self):
        """Test Category list (public) and create (admin)"""
        # Public list
        list_res = self.client.get('/api/categories/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)

        # Unauthenticated cannot create
        unauth_res = self.client.post('/api/categories/', {'name': 'Oziq-ovqat', 'slug': 'oziq-ovqat'}, format='json')
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Admin can create
        self.client.force_authenticate(user=self.admin)
        res = self.client.post('/api/categories/', {
            'name': 'Oziq-ovqat',
            'slug': 'oziq-ovqat',
            'icon': 'Coffee'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['slug'], 'oziq-ovqat')

    def test_multilingual_product(self):
        """Test product with Russian fields"""
        self.client.force_authenticate(user=self.admin)
        res = self.client.post('/api/products/', {
            'name': 'Sovun',
            'name_ru': 'Мыло жидкое',
            'category': 'kanselyariya',
            'price': 15000.00,
            'description': 'Tabiiy sovun',
            'description_ru': 'Натуральное жидкое мыло'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['name_ru'], 'Мыло жидкое')
        self.assertEqual(res.data['description_ru'], 'Натуральное жидкое мыло')

    def test_base64_image_converted_on_product_create(self):
        """Test that data:image/ base64 URLs in product images are converted to physical media files"""
        self.client.force_authenticate(user=self.admin)
        # 1x1 transparent WebP base64
        tiny_webp_b64 = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA="
        res = self.client.post('/api/products/', {
            'name': 'Test Base64 Mahsulot',
            'category': 'kanselyariya',
            'price': 10000.00,
            'images': [tiny_webp_b64]
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        created_prod = Product.objects.get(id=res.data['id'])
        img = created_prod.product_images.first()
        self.assertIsNotNone(img)
        self.assertFalse(img.image_url.startswith('data:'))
        self.assertTrue(img.image_url.startswith('/media/products/') or 'products/' in img.image_url)

    def test_base64_image_converted_on_category_create(self):
        """Test that data:image/ base64 URLs in category image are converted to physical media files"""
        self.client.force_authenticate(user=self.admin)
        tiny_webp_b64 = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA="
        res = self.client.post('/api/categories/', {
            'name': 'Test Base64 Kategoriya',
            'slug': 'test-b64-cat',
            'image': tiny_webp_b64
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        cat = Category.objects.get(slug='test-b64-cat')
        self.assertFalse(cat.image.startswith('data:'))
        self.assertTrue(cat.image.startswith('/media/categories/') or 'categories/' in cat.image)

    def test_convert_base64_management_command(self):
        """Test the convert_base64_images management command"""
        from django.core.management import call_command
        tiny_webp_b64 = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA="
        
        prod = Product.objects.create(
            id='snb-cmd-test-prod',
            name='Command Test Product',
            category=self.category,
            price=5000.00
        )
        ProductImage.objects.create(
            product=prod,
            image_url=tiny_webp_b64,
            is_main=True,
            order=0
        )
        cat = Category.objects.create(
            id='cmd-test-cat',
            slug='cmd-test-cat',
            name='Command Test Category',
            image=tiny_webp_b64
        )

        call_command('convert_base64_images')

        prod_img = ProductImage.objects.get(product=prod)
        self.assertFalse(prod_img.image_url.startswith('data:'))
        self.assertTrue(prod_img.image_url.startswith('/media/products/') or 'products/' in prod_img.image_url)

        updated_cat = Category.objects.get(id='cmd-test-cat')
        self.assertFalse(updated_cat.image.startswith('data:'))
        self.assertTrue(updated_cat.image.startswith('/media/categories/') or 'categories/' in updated_cat.image)
