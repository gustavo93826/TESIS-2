from django.db import models
from django.core.validators import RegexValidator
class Cliente(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200, verbose_name="Nombre del Cliente")
    telefono = models.CharField(max_length=15,blank=True, null=True, validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', 
                message="El número de teléfono debe estar en el formato: '+999999999'. Hasta 15 dígitos permitidos."
            )
        ]
    )
    correo = models.EmailField(max_length=150, verbose_name="Correo Electrónico del Cliente", blank=True, null=True)
    direccion = models.TextField(verbose_name="Dirección del Cliente", blank=True, null=True)
    documentos = models.ManyToManyField('Documentos.Documento', related_name='clientes', blank=True, verbose_name="Documentos asociados")

    def __str__(self):
        return self.nombre

    class Meta:
        
        db_table = "Clientes"
