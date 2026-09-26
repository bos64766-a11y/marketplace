from django.db import migrations


def set_admin_password(apps, schema_editor):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admin_user = User.objects.filter(username='admin').first()
    if admin_user:
        admin_user.set_password('admin123!@')
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()
    else:
        User.objects.create_superuser(
            username='admin',
            email='admin@snabtash.uz',
            password='admin123!@'
        )


def reverse_admin_password(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('settings_app', '0007_showcasesection_subtitle_ru_showcasesection_title_ru'),
    ]

    operations = [
        migrations.RunPython(set_admin_password, reverse_admin_password),
    ]
