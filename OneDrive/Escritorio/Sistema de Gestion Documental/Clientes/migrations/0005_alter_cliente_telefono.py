# Generated by Django 5.1.3 on 2024-12-17 20:47

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0004_alter_cliente_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cliente',
            name='telefono',
            field=models.CharField(default=0, max_length=15, validators=[django.core.validators.RegexValidator(message="El número de teléfono debe estar en el formato: '+999999999'. Hasta 15 dígitos permitidos.", regex='^\\+?1?\\d{9,15}$')]),
            preserve_default=False,
        ),
    ]
