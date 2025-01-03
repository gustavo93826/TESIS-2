from django.db import models
from django.contrib.auth import get_user_model
from Documentos.models import Documento

User = get_user_model()

# Modelo de Permisos Globales
class PermisoGlobal(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="permisos_globales", verbose_name="Usuario")
    
    # Acciones individuales
    subir_documento = models.BooleanField(default=False, verbose_name="Permiso para subir documentos")
    crear_carpeta = models.BooleanField(default=False, verbose_name="Permiso para crear carpetas")
    editar = models.BooleanField(default=False, verbose_name="Permiso para editar")
    mover = models.BooleanField(default=False, verbose_name="Permiso para mover")
    eliminar = models.BooleanField(default=False, verbose_name="Permiso para eliminar")
    ver = models.BooleanField(default=False, verbose_name="Permiso para ver documentos")
    descargar = models.BooleanField(default=False, verbose_name="Permiso para descargar documentos")
    
    def __str__(self):
        return f"Permisos Globales - {self.usuario.get_full_name() or self.usuario.username}"

# Modelo de Permisos Individuales
class PermisoIndividual(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="permisos_individuales", verbose_name="Usuario")
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name="permisos_asignados", verbose_name="Documento")
    
    # Acciones individuales
    ver = models.BooleanField(default=False, verbose_name="Permiso para ver este documento")
    descargar = models.BooleanField(default=False, verbose_name="Permiso para descargar este documento")
    editar = models.BooleanField(default=False, verbose_name="Permiso para editar este documento")
    mover = models.BooleanField(default=False, verbose_name="Permiso para mover este documento")
    eliminar = models.BooleanField(default=False, verbose_name="Permiso para eliminar este documento")
    
    class Meta:
        unique_together = ('usuario', 'documento')  # Evita duplicados de permisos para el mismo usuario y documento

    def __str__(self):
        return f"Permisos {self.documento.nombre} - {self.usuario.get_full_name() or self.usuario.username}"
