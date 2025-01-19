from django.db import models
from usuarios.models import Usuario
from Documentos.models import Documento
from Documentos.Carpetas import Carpeta

class Registro(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='registros',
        verbose_name="Usuario"
    )
    documento = models.ForeignKey(
        Documento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='registros_documento',
        verbose_name="Documento asociado"
    )
    carpeta = models.ForeignKey(
        Carpeta,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='registros_carpeta',
        verbose_name="Carpeta asociada"
    )
    descripcion = models.TextField(verbose_name="Descripción de la actividad")
    fecha_hora = models.DateTimeField(auto_now_add=True, verbose_name="Fecha y hora de la actividad")

    def __str__(self):
        usuario = self.usuario.nombre if self.usuario else "Usuario eliminado"
        return f"[{self.fecha_hora}] {usuario} - {self.descripcion}"

    class Meta:
        db_table = "Registro"
        
