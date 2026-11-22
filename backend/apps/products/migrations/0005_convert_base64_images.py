import base64
import re
from django.db import migrations
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def convert_base64_to_media(apps, schema_editor):
    ProductImage = apps.get_model('products', 'ProductImage')
    Category = apps.get_model('products', 'Category')

    # Convert ProductImage
    converted_prods = 0
    for img_obj in ProductImage.objects.all():
        data_url = img_obj.image_url
        if data_url and data_url.startswith('data:image/'):
            match = re.match(r'^data:image/([a-zA-Z0-9\+\-\.]+);base64,(.+)$', data_url, re.DOTALL)
            if match:
                mime_sub = match.group(1).lower()
                b64_data = match.group(2)
                ext = '.webp'
                if 'png' in mime_sub:
                    ext = '.png'
                elif 'jpeg' in mime_sub or 'jpg' in mime_sub:
                    ext = '.jpg'

                prod_id = img_obj.product_id or 'prod'
                suffix = f"_{img_obj.order}" if img_obj.order > 0 else ""
                filename = f"products/{prod_id}{suffix}{ext}"

                try:
                    if not default_storage.exists(filename):
                        file_bytes = base64.b64decode(b64_data)
                        default_storage.save(filename, ContentFile(file_bytes))
                    img_obj.image_url = default_storage.url(filename)
                    img_obj.save(update_fields=['image_url'])
                    converted_prods += 1
                except Exception as e:
                    print(f"Error converting ProductImage {img_obj.id}: {e}")

    # Convert Category images
    converted_cats = 0
    for cat in Category.objects.all():
        data_url = cat.image
        if data_url and data_url.startswith('data:image/'):
            match = re.match(r'^data:image/([a-zA-Z0-9\+\-\.]+);base64,(.+)$', data_url, re.DOTALL)
            if match:
                mime_sub = match.group(1).lower()
                b64_data = match.group(2)
                ext = '.webp'
                if 'png' in mime_sub:
                    ext = '.png'
                elif 'jpeg' in mime_sub or 'jpg' in mime_sub:
                    ext = '.jpg'

                cat_id = cat.id or cat.slug or 'cat'
                filename = f"categories/{cat_id}{ext}"

                try:
                    if not default_storage.exists(filename):
                        file_bytes = base64.b64decode(b64_data)
                        default_storage.save(filename, ContentFile(file_bytes))
                    cat.image = default_storage.url(filename)
                    cat.save(update_fields=['image'])
                    converted_cats += 1
                except Exception as e:
                    print(f"Error converting Category {cat.id}: {e}")

    if converted_prods or converted_cats:
        print(f"[0005_convert_base64_images] Converted {converted_prods} product images and {converted_cats} category images to physical files.")


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_alter_product_brand_alter_product_unit'),
    ]

    operations = [
        migrations.RunPython(convert_base64_to_media, reverse_code=migrations.RunPython.noop),
    ]
