# Generated by Django 5.1.3 on 2025-01-19 22:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Documentos', '0019_carpeta_carpeta_padre'),
        ('usuarios', '0009_usuario_reset_token_usuario_reset_token_expiration'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='creado_por',
            field=models.ForeignKey(default=100, on_delete=django.db.models.deletion.SET_DEFAULT, related_name='documentos_creados', to='usuarios.usuario', verbose_name='Creado por'),
        ),
    ]
