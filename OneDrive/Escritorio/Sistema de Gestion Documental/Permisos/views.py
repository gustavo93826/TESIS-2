from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import PermisoGlobal
from usuarios.models import Usuario
import json
from django.views.decorators.csrf import csrf_exempt
from Clientes.models import Cliente
@csrf_exempt
def listar_permisos(request):
    if request.method == "GET":
        permisos = PermisoGlobal.objects.select_related('usuario').order_by("usuario__rol")
        data = [
            {
                "id": permiso.usuario.id,
                "nombre": permiso.usuario.nombre,
                "rol": permiso.usuario.rol,
                "activar": permiso.activar,
                "subir_archivo": permiso.subir_archivo,
                "crear_carpeta": permiso.crear_carpeta,
                "editar": permiso.editar,
                "ver": permiso.ver,
                "eliminar": permiso.eliminar,
                "descargar": permiso.descargar,
            }
            for permiso in permisos
        ]
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        user_id = request.POST.get("user_id")
        permiso = request.POST.get("permiso")
        estado = request.POST.get("estado") == "true"

        try:
            permiso_global = PermisoGlobal.objects.get(usuario_id=user_id)
            setattr(permiso_global, permiso, estado)
            permiso_global.save()
            return JsonResponse({"success": True, "message": "Permiso actualizado correctamente."})
        except PermisoGlobal.DoesNotExist:
            return JsonResponse({"success": False, "message": "Permiso no encontrado."}, status=404)

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
        

@csrf_exempt
def obtener_permisos(request):
    if request.method == 'GET':
        user_id = request.GET.get('id')  
        if not user_id:
            return JsonResponse({'error': 'Falta el ID del usuario.'}, status=400)
        
        try:
            permisos_obj = PermisoGlobal.objects.get(usuario_id=user_id)
            permisos = {
                "activar": permisos_obj.activar,
                "subir_archivo": permisos_obj.subir_archivo,
                "crear_carpeta": permisos_obj.crear_carpeta,
                "editar": permisos_obj.editar,
                "eliminar": permisos_obj.eliminar,
                "ver": permisos_obj.ver,
                "descargar": permisos_obj.descargar,
            }
            return JsonResponse(permisos, status=200)
        except PermisoGlobal.DoesNotExist:
            return JsonResponse({'error': 'No se encontraron permisos.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Error interno: {str(e)}'}, status=500)
        

def permisos_cliente(request):
    try:
        
        user_id = request.GET.get("user_id")
        if not user_id:
            return JsonResponse({"success": False, "message": "Falta el parámetro 'user_id'."}, status=400)

        
        permiso_global = get_object_or_404(PermisoGlobal, usuario_id=user_id)

        # Serializar los clientes asociados al permiso
        clientes_ids = list(permiso_global.cliente_archivos.values_list("id", flat=True))

        # Si no hay clientes asociados, esto implica que tiene acceso a "todos"
        response_data = {
            "success": True,
            "cliente_archivos": clientes_ids
        }

        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)


@csrf_exempt
def actualizar_permisos_clientes(request):
    if request.method == "POST":
        try:
            datos = json.loads(request.body)
            user_id = datos.get("user_id")
            cliente_ids = datos.get("cliente_ids")  # Lista de IDs de clientes o "todos"

            permiso_global = get_object_or_404(PermisoGlobal, usuario_id=user_id)

            if cliente_ids == "todos":
                permiso_global.cliente_archivos.clear()  # Establecer en NULL
            else:
                clientes = Cliente.objects.filter(id__in=cliente_ids)
                permiso_global.cliente_archivos.set(clientes)  # Asignar clientes específicos
            
            permiso_global.save()
            return JsonResponse({"success": True, "message": "Permisos actualizados correctamente."})
        
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
        
        
        
        
        
@csrf_exempt
def obtener_ids_clientes_archivos(request):
    try:
        user_id = request.GET.get("user_id")
        if not user_id:
            return JsonResponse({"success": False, "message": "Falta el parámetro 'user_id'."}, status=400)

        permiso_global = get_object_or_404(PermisoGlobal, usuario_id=user_id)

        # Obtener los IDs de los clientes asociados
        clientes_ids = list(permiso_global.cliente_archivos.values_list("id", flat=True))

        return JsonResponse({
            "success": True,
            "cliente_archivos_ids": clientes_ids
        }, status=200)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
