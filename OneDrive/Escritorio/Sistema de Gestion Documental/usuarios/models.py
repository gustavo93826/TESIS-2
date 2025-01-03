from datetime import datetime, timedelta
from django.utils import timezone
from django.db import models
import uuid

class Usuario(models.Model):
    ROLES = [
        (1, 'Administrador'),
        (2, 'Abogado'),
        (3, 'Auxiliar Administrativo'),
        (4, 'Asistente'),
    ]

    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, blank=True, null=True)
    temp_password = models.CharField(max_length=128, blank=True, null=True)
    rol = models.IntegerField(choices=ROLES)
    fecha_creacion = models.DateTimeField(default=datetime.now)

    # Campos para el token de restablecimiento de contraseña
    reset_token = models.UUIDField(blank=True, null=True, unique=True)
    reset_token_expiration = models.DateTimeField(blank=True, null=True)

    def generar_token_reset(self):
        """Genera un token único y su fecha de expiración (1 hora)."""
        self.reset_token = uuid.uuid4()
        self.reset_token_expiration = timezone.now() + timedelta(hours=1)
        self.save()

    def validar_token_reset(self, token):
        """Valida si el token es válido y no ha expirado."""
        return self.reset_token == token and datetime.now() < self.reset_token_expiration

    def limpiar_token_reset(self):
        """Limpia el token y su fecha de expiración."""
        self.reset_token = None
        self.reset_token_expiration = None
        self.save()

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "Usuarios"
