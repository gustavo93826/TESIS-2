from django.http import JsonResponse
from .models import Registro
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Registro
from django.db.models import Q
import json

@csrf_exempt
def obtener_registros(request):
    """
    Devuelve una lista ordenada de las descripciones de los registros filtrados.
    """
    try:
        filtros = json.loads(request.body) if request.method == "POST" else {}
        print(f"Filtros recibidos: {filtros}")
        query = Q()

        # Filtros opcionales
        if "usuario" in filtros and filtros["usuario"]:
            query &= Q(usuario_id=filtros["usuario"])
        if "cliente" in filtros and filtros["cliente"]:
            query &= Q(cliente_id=filtros["cliente"])
        if "carpeta" in filtros and filtros["carpeta"]:
            query &= Q(carpeta_id=filtros["carpeta"])
        if "documento" in filtros and filtros["documento"]:
            query &= Q(documento_id=filtros["documento"])
        if "fecha" in filtros and filtros["fecha"]:
            query &= Q(fecha_hora__date=filtros["fecha"])

        registros = Registro.objects.filter(query).order_by('fecha_hora')
        lista_descripciones = [
            f"{registro.descripcion}\n" for registro in registros
        ]
        return JsonResponse({"registros": lista_descripciones}, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def borrar_registros(request):
    """
    Borra todos los registros de la tabla Registro.
    """
    if request.method == "DELETE":
        try:
            Registro.objects.all().delete()
            return JsonResponse({"mensaje": "Todos los registros han sido eliminados."}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)
