from django.db import models

from django.contrib.auth import get_user_model
from Documentos.models import Documento  # Si quieres relacionarlo con documentos

User = get_user_model()

class RegistroActividad(models.Model):
    ACCIONES = [
        ('subir', 'Subir Documento'),
        ('editar', 'Editar Documento'),
        ('eliminar', 'Eliminar Documento'),
        ('ver', 'Ver Documento'),
        ('descargar', 'Descargar Documento'),
        # Agrega más acciones según sea necesario
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="registros_actividad", verbose_name="Usuario")
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name="registros_actividad", verbose_name="Documento", null=True, blank=True)
    accion = models.CharField(max_length=50, choices=ACCIONES, verbose_name="Acción realizada")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de la actividad")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción de la actividad")

    def __str__(self):
        return f"{self.usuario} - {self.accion} - {self.fecha}"

    class Meta:
        db_table = "Registro de Actividades"