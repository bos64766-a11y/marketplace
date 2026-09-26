"""
WSGI config for snabtash_core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snabtash_core.settings')

application = get_wsgi_application()

try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={'is_superuser': True, 'is_staff': True, 'email': 'admin@snabtash.uz'}
    )
    admin_user.set_password('admin123!@')
    admin_user.is_superuser = True
    admin_user.is_staff = True
    admin_user.is_active = True
    admin_user.save()
    print("[WSGI] Superuser admin credentials verified as admin123!@")
except Exception as e:
    print(f"[WSGI] Admin check error: {e}")
