import base64
import re
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from apps.products.models import ProductImage, Category


class Command(BaseCommand):
    help = 'Converts base64 data: URLs in ProductImage and Category models to physical media files.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting base64 image migration to media files...'))

        prod_count = 0
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
                        prod_count += 1
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(f"Error converting ProductImage {img_obj.id}: {e}"))

        cat_count = 0
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
                        cat_count += 1
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(f"Error converting Category {cat.id}: {e}"))

        self.stdout.write(self.style.SUCCESS(
            f"Successfully converted {prod_count} product images and {cat_count} category images."
        ))
