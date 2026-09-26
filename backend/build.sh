#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u, _ = User.objects.get_or_create(username='admin', defaults={'is_superuser': True, 'is_staff': True, 'email': 'admin@snabtash.uz'}); u.set_password('admin123!@'); u.is_superuser = True; u.is_staff = True; u.save(); print('[ADMIN] Superuser admin password set to admin123!@')"
python restore_database.py || true

