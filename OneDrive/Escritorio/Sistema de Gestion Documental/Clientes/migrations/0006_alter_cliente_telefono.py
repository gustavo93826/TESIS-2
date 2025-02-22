# Generated by Django 5.1.3 on 2024-12-18 23:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0005_alter_cliente_telefono'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cliente',
            name='telefono',
            field=models.CharField(blank=True, max_length=15, null=True, validators=[django.core.validators.RegexValidator(message="El número de teléfono debe estar en el formato: '+999999999'. Hasta 15 dígitos permitidos.", regex='^\\+?1?\\d{9,15}$')]),
        ),
    ]
