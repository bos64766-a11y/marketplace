import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files.base import File


class Command(BaseCommand):
    help = 'Synchronizes local media files to S3/Cloudflare R2 bucket when Object Storage is configured.'

    def handle(self, *args, **options):
        if not getattr(settings, 'USE_S3', False):
            self.stdout.write(self.style.WARNING(
                'USE_S3 is not enabled or AWS_STORAGE_BUCKET_NAME is not set. Media is served locally.'
            ))
            return

        from storages.backends.s3boto3 import S3Boto3Storage
        s3_storage = S3Boto3Storage()
        media_root = settings.MEDIA_ROOT

        if not os.path.exists(media_root):
            self.stdout.write(self.style.WARNING(f"MEDIA_ROOT ({media_root}) does not exist."))
            return

        uploaded_count = 0
        for root, _, files in os.walk(media_root):
            for file_name in files:
                local_path = os.path.join(root, file_name)
                rel_path = os.path.relpath(local_path, media_root).replace('\\', '/')
                
                try:
                    if not s3_storage.exists(rel_path):
                        with open(local_path, 'rb') as f:
                            s3_storage.save(rel_path, File(f))
                        self.stdout.write(f"Uploaded: {rel_path}")
                        uploaded_count += 1
                    else:
                        self.stdout.write(f"Already exists in S3: {rel_path}")
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f"Failed to upload {rel_path}: {e}"))

        self.stdout.write(self.style.SUCCESS(
            f"S3 media synchronization complete. Uploaded {uploaded_count} files."
        ))
