from django.http import JsonResponse
from .models import Registro
from django.views.decorators.csrf import csrf_exempt

def obtener_registros(request):
    """
    Devuelve una lista ordenada de las descripciones de los registros.
    """
    try:
        registros = Registro.objects.order_by('fecha_hora')  # Ordenar por fecha (más recientes primero)
        lista_descripciones = [
            f"{registro.descripcion}\n"
            for registro in registros
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
