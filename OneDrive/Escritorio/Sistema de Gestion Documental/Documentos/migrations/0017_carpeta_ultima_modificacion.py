# Generated by Django 5.1.3 on 2024-12-29 22:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Documentos', '0016_carpeta_documento_carpeta'),
    ]

    operations = [
        migrations.AddField(
            model_name='carpeta',
            name='ultima_modificacion',
            field=models.DateTimeField(auto_now=True, verbose_name='Última modificación'),
        ),
    ]
