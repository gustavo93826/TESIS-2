from django.db.models.signals import post_save
from django.dispatch import receiver
from usuarios.models import Usuario
from .models import PermisoGlobal

@receiver(post_save, sender=Usuario)
def crear_permisos_para_usuario(sender, instance, created, **kwargs):
    if created:  # Solo ejecuta este código cuando se crea un usuario
        permiso = PermisoGlobal.objects.create(usuario=instance)
        
        # Asegúrate de que los datos estén sincronizados
        instance.refresh_from_db()
        
        # Asigna los permisos basados en el rol del usuario
        permiso.asignar_permisos_por_rol()
