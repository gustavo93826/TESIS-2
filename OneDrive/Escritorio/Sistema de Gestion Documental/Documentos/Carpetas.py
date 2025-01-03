from django.db import models
from django.contrib.auth import get_user_model
from Clientes.models import Cliente
from usuarios.models import Usuario

class Carpeta(models.Model):
    nombre = models.CharField(max_length=255)  # Nombre de la carpeta
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='carpetas' )  # Relación con el cliente
    url = models.CharField(max_length=500)  # Ruta física de la carpeta
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE,  related_name='carpetas_creadas',
    )  
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    ultima_modificacion = models.DateTimeField(auto_now=True, verbose_name="Última modificación")
    carpeta_padre = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcarpetas')  # Relación con carpeta padre

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "Carpetas"
