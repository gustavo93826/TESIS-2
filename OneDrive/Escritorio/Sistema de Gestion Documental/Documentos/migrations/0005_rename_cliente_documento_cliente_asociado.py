# Generated by Django 5.1.3 on 2024-12-19 19:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Documentos', '0004_alter_documento_creado_por'),
    ]

    operations = [
        migrations.RenameField(
            model_name='documento',
            old_name='cliente',
            new_name='cliente_asociado',
        ),
    ]
