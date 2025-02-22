# Generated by Django 5.1.3 on 2024-12-28 22:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0006_alter_cliente_telefono'),
        ('Documentos', '0015_remove_documento_carpeta_delete_carpeta'),
        ('usuarios', '0009_usuario_reset_token_usuario_reset_token_expiration'),
    ]

    operations = [
        migrations.CreateModel(
            name='Carpeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=500)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='carpetas', to='Clientes.cliente')),
                ('creado_por', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='carpetas_creadas', to='usuarios.usuario')),
            ],
            options={
                'db_table': 'Carpetas',
            },
        ),
        migrations.AddField(
            model_name='documento',
            name='carpeta',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='documentos', to='Documentos.carpeta', verbose_name='Carpeta asociada'),
        ),
    ]
