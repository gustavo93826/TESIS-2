# Generated by Django 5.1.3 on 2024-12-28 15:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Documentos', '0010_documento_carpeta_ruta_alter_documento_archivo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='documento',
            name='carpeta_ruta',
        ),
    ]
