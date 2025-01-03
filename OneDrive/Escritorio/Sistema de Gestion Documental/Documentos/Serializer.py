from rest_framework import serializers
from .models import Documento
from .Carpetas import Carpeta

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = [
            'id',
            'nombre',
            'comentario',
            'categoria',
            'archivo',
            'privacidad',
            'cliente',
            'creado_por',
            'fecha_creacion',
            'ultima_modificacion',
        ]
        read_only_fields = ['fecha_creacion', 'ultima_modificacion']
        
    
    

class CarpetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carpeta
        fields = [
            'id',
            'nombre',
            'cliente',
            'url',
            'creado_por',
            'fecha_creacion',
            'ultima_modificacion',
            'carpeta_padre',
        ]
        read_only_fields = ['fecha_creacion', 'ultima_modificacion']
