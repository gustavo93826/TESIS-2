from django.apps import AppConfig


class PermisosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "Permisos"

    def ready(self):
        import Permisos.signals  # Importa las señales al iniciar la app
