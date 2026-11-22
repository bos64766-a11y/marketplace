from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('settings_app', '0007_showcasesection_subtitle_ru_showcasesection_title_ru'),
    ]

    operations = [
        migrations.RunPython(migrations.RunPython.noop, migrations.RunPython.noop),
    ]
