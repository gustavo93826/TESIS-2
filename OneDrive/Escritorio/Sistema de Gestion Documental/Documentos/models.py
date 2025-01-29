from django.db import models
from django.contrib.auth import get_user_model
from Clientes.models import Cliente
from usuarios.models import Usuario
from .Carpetas import Carpeta


# Modelo de Documento
class Documento(models.Model):
    PRIVACIDAD_CHOICES = [
        ('publico', 'Público'),
        ('privado', 'Privado'),
    ]
    
    TIPO_CHOICES = [
        ('acta', 'Acta'),
        ('acuerdo', 'Acuerdo'),
        ('carta', 'Carta'),
        ('cierres', 'Cierres'),
        ('comunicacion', 'Comunicacion'),
        ('contrato', 'Contrato'),
        ('declaracion', 'Declaración'),
        ('demanda', 'Demanda'),
        ('disposicion', 'Disposición'),
        ('estatutos', 'Estatutos'),
        ('forma', 'Forma'),
        ('memorandum', 'Memorandum'),
        ('oficio', 'Oficio'),
        ('poder', 'Poder'),
        ('quejas', 'Quejas'),
        ('repuesta', 'Repuesta'),
        ('reporte', 'Reporte'),
        ('resolucion', 'Resolución'),
        ('sentencia', 'Sentencia'),
        ('solicitud', 'Solicitud'),
        ('otro', 'Otro'),
    ]
    nombre = models.CharField(max_length=255, verbose_name="Nombre del documento")
    comentario = models.TextField(blank=True, null=True, verbose_name="Comentario del documento")
    categoria = models.CharField(max_length= 15, choices= TIPO_CHOICES, default='otro')
    archivo = models.FileField(upload_to='documentos/', default='documentos/', verbose_name="Archivo")
    carpeta=models.ForeignKey(Carpeta, on_delete=models.CASCADE, null=True, blank=True, related_name="documentos", 
    verbose_name="Carpeta asociada")
    creado_por = models.ForeignKey(Usuario, on_delete=models.SET_DEFAULT,default=100 ,related_name="documentos_creados", verbose_name="Creado por")
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_DEFAULT, default=100,related_name="documentos_cliente", verbose_name="Cliente asociado")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    ultima_modificacion = models.DateTimeField(auto_now=True, verbose_name="Última modificación")
    privacidad = models.CharField(max_length=10, choices=PRIVACIDAD_CHOICES, default='privado', verbose_name="Privacidad del documento")
    

    def __str__(self):
        return f"{self.nombre} - {self.creado_por}"

    class Meta:
        db_table = "Documentos"