from django.db import models
from usuarios.models import Usuario
from Clientes.models import Cliente

# Modelo de Permisos Globales
class PermisoGlobal(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="permisos_globales",
        verbose_name="Usuario"
    )
    
    activar = models.BooleanField(default=True, verbose_name="Permiso activado")
    
    subir_archivo = models.BooleanField(default=False, verbose_name="Permiso para subir documentos")
    crear_carpeta = models.BooleanField(default=False, verbose_name="Permiso para crear carpetas")
    editar = models.BooleanField(default=False, verbose_name="Permiso para editar")
    mover = models.BooleanField(default=False, verbose_name="Permiso para mover")
    eliminar = models.BooleanField(default=False, verbose_name="Permiso para eliminar")
    ver = models.BooleanField(default=False, verbose_name="Permiso para ver documentos")
    descargar = models.BooleanField(default=False, verbose_name="Permiso para descargar documentos")
    cliente_archivos = models.ManyToManyField(Cliente,blank=True,related_name="permisos_asociados",        verbose_name="Clientes asociados para permisos específicos"
    )

    def __str__(self):
        return f"Permisos Globales - {self.usuario.nombre}"

    class Meta:
        db_table = "permisos_globales"
        verbose_name = "Permiso Global"
        verbose_name_plural = "Permisos Globales"

    def asignar_permisos_por_rol(self):
        """
        Asigna los permisos globales según el rol del usuario.
        """
        if self.usuario.rol == 2:  # Abogado
            self.subir_archivo = True
            self.crear_carpeta = True
            self.editar = True
            self.mover = True
            self.eliminar = True
            self.ver = True
            self.descargar = True
        elif self.usuario.rol == 3:  # Auxiliar Administrativo
            self.subir_archivo = True
            self.crear_carpeta = True
            self.editar = True
            self.mover = True
            self.eliminar = False
            self.ver = True
            self.descargar = False
        elif self.usuario.rol == 4:  # Asistente
            self.subir_archivo = False
            self.crear_carpeta = False
            self.editar = False
            self.mover = False
            self.eliminar = False
            self.ver = False
            self.descargar = False
        self.save()
