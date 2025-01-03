from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from .models import Documento
from Clientes.models import Cliente
from usuarios.models import Usuario
from .Carpetas import Carpeta
from .Serializer import DocumentoSerializer
from django.core.exceptions import ValidationError
import os
from django.core.files.storage import FileSystemStorage
from django.db.models import Q
import shutil
from django.views.decorators.http import require_GET

from django.core.exceptions import ObjectDoesNotExist

class DocumentoUploadView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            cliente_id = request.data.get('cliente')
            cliente = Cliente.objects.get(id=cliente_id)

            creado_por = request.data.get('creado_por')
            usuario = Usuario.objects.get(nombre=creado_por)

            carpeta_id = request.data.get('carpeta')  # ID de la carpeta enviada desde el frontend

            # Verificar si se proporciona una carpeta o si se está en "documentos/"
            carpeta = None
            if carpeta_id:  # Si se proporciona un ID de carpeta
                carpeta = Carpeta.objects.get(id=carpeta_id)

            ruta_actual = request.data.get('rutaActual', 'documentos/')  # Ruta enviada desde el frontend
            archivo = request.FILES['archivo']
            nombre_original = request.data.get('nombre')

            _, extension = os.path.splitext(archivo.name)
            nombre_con_extension = f"{nombre_original}{extension}"

            # Definir la ruta completa del archivo
            ruta_completa = os.path.join(ruta_actual, nombre_con_extension)

            # Guardar el archivo en la ruta definida
            fs = FileSystemStorage(location='media/' + ruta_actual)
            archivo_guardado = fs.save(nombre_con_extension, archivo)

            # Crear el documento en la base de datos
            documento = Documento(
                nombre=nombre_con_extension,
                comentario=request.data.get('comentario'),
                categoria=request.data.get('categoria', 'otro'),
                archivo=ruta_completa,  # Guardar ruta completa en la base de datos
                privacidad=request.data.get('privacidad', 'privado'),
                cliente=cliente,
                creado_por=usuario,
                carpeta=carpeta  # Asignar NULL si no se está en una subcarpeta
            )
            documento.save()

            serializer = DocumentoSerializer(documento)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Carpeta.DoesNotExist:
            return Response({'error': 'La carpeta especificada no existe.'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Error interno del servidor: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentoListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            ruta = request.query_params.get('ruta', 'documentos/')
            search = request.query_params.get('search', '').strip().lower()

            if search:
                # Búsqueda global por nombre
                documentos = Documento.objects.filter(
                    Q(nombre__icontains=search)
                ).select_related('cliente', 'creado_por')
            else:
                # Filtrar por ruta
                documentos = Documento.objects.filter(
                    Q(archivo__startswith=ruta) & Q(archivo__regex=rf"^{ruta}[^/]+$")
                ).select_related('cliente', 'creado_por')

            data = [
                {
                    "id": documento.id,
                    "nombre": documento.nombre,
                    "archivo": documento.archivo.url if documento.archivo else None,
                    "creado_por": documento.creado_por.nombre,
                    "categoria": documento.categoria,
                    "cliente": documento.cliente.nombre,
                    "privacidad": documento.privacidad,
                    "fecha_creacion": documento.fecha_creacion,
                    "ultima_modificacion": documento.ultima_modificacion,
                    "comentario": documento.comentario,
                }
                for documento in documentos
            ]

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CarpetaListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            
            ruta = request.query_params.get('ruta', 'documentos/')
            search = request.query_params.get('search', '').strip().lower()

            if search:
                # Búsqueda global por nombre
                carpetas = Carpeta.objects.filter(
                    Q(nombre__icontains=search) 
                ).select_related('cliente', 'creado_por')
            else:
                # Filtrar por ruta
                carpetas = Carpeta.objects.filter(
                     Q(url__startswith=ruta) & Q(url__regex=rf"^{ruta}[^/]+/$")
                ).select_related('cliente', 'creado_por')

            data = [
                {
                    "id": carpeta.id,
                    "nombre": carpeta.nombre,
                    "url": carpeta.url,
                    "creado_por": carpeta.creado_por.nombre,
                    "cliente": carpeta.cliente.nombre,
                    "fecha_creacion": carpeta.fecha_creacion,
                    "ultima_modificacion": carpeta.ultima_modificacion,
                }
                for carpeta in carpetas
            ]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Error interno del servidor: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


        
        
@csrf_exempt
def eliminar_documento(request, documento_id):
    if request.method == "DELETE":
        documento = get_object_or_404(Documento, id=documento_id)
        
        # Obtener la ruta del archivo en el sistema de archivos
        ruta_archivo = os.path.join(settings.MEDIA_ROOT, documento.archivo.name)
        
        # Eliminar el registro de la base de datos
        documento.delete()
        
        # Eliminar el archivo físico si existe
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)
        
        return JsonResponse({"mensaje": "Documento eliminado correctamente."})
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)
    
    
    
class DocumentoUpdateView(APIView):
    def put(self, request, documento_id, *args, **kwargs):
        try:
            # Obtener el documento existente
            documento = get_object_or_404(Documento, id=documento_id)

            # Extraer los datos del request
            nuevo_nombre = request.data.get('nombre')
            nueva_categoria = request.data.get('categoria')
            nuevo_cliente_id = request.data.get('cliente')

            # Actualizar nombre sin cambiar la extensión
            if nuevo_nombre:
                _, extension = os.path.splitext(documento.nombre)
                documento.nombre = f"{nuevo_nombre}{extension}"

            # Actualizar categoría
            if nueva_categoria:
                documento.categoria = nueva_categoria

            # Actualizar cliente
            if nuevo_cliente_id:
                nuevo_cliente = get_object_or_404(Cliente, id=nuevo_cliente_id)
                documento.cliente = nuevo_cliente

            # Guardar los cambios
            documento.save()

            # Serializar y devolver respuesta
            serializer = DocumentoSerializer(documento)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CrearCarpetaView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Obtener datos del cuerpo de la solicitud
            nombre = request.data.get('nombre')  # Nombre de la carpeta
            cliente_id = request.data.get('cliente')
            cliente = Cliente.objects.get(id=cliente_id)
            creado_por = request.data.get('creado_por')
            usuario = Usuario.objects.get(nombre=creado_por)
            ruta_actual = request.data.get('ruta', 'documentos/')  # Ruta actual donde se creará la carpeta
            parent_id = request.data.get('carpeta_padre')
            
            if not nombre:
                return Response({"error": "El nombre de la carpeta es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
            if not cliente_id:
                return Response({"error": "El cliente asociado es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
            
            carpeta_padre = None if parent_id in [None, '0', 0] else Carpeta.objects.get(id=parent_id)
            nueva_ruta = os.path.join(settings.MEDIA_ROOT, ruta_actual.rstrip('/'), nombre)
            
            # Verificar si la carpeta ya existe
            if os.path.exists(nueva_ruta):
                return Response({"error": "La carpeta ya existe."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Crear físicamente la carpeta
            os.makedirs(nueva_ruta)


            # Crear la carpeta en la base de datos
            carpeta = Carpeta(
                nombre=nombre,
                cliente=cliente,
                url=f"{ruta_actual.rstrip('/')}/{nombre}/",
                creado_por=usuario, 
                carpeta_padre=carpeta_padre
            )
            carpeta.save()
            # Respuesta exitosa
            return Response(
                {
                    "mensaje": "Carpeta creada exitosamente.",
                    "carpeta": {
                        "id": carpeta.id,
                        "nombre": carpeta.nombre,
                        "url": carpeta.url,
                        "cliente": carpeta.cliente.nombre,
                        "creado_por": carpeta.creado_por.nombre if carpeta.creado_por else None,
                        "carpeta_padre": carpeta.carpeta_padre.id if carpeta.carpeta_padre else None,
                        
                    },
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"Error al crear la carpeta: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            

class CarpetaUpdateView(APIView):
    def put(self, request, carpeta_id, *args, **kwargs):
        try:
            # Obtener la carpeta existente
            carpeta = get_object_or_404(Carpeta, id=carpeta_id)

            # Extraer los datos del request
            nuevo_nombre = request.data.get('nombre')
            nuevo_cliente_id = request.data.get('cliente')

            # Actualizar nombre de la carpeta
            if nuevo_nombre:
                carpeta.nombre = nuevo_nombre

            # Actualizar cliente
            if nuevo_cliente_id:
                nuevo_cliente = get_object_or_404(Cliente, id=nuevo_cliente_id)
                carpeta.cliente = nuevo_cliente

            # Guardar los cambios
            carpeta.save()
            
            return Response(
                {"message": "Carpeta actualizada con éxito", "data": {
                    "id": carpeta.id,
                    "nombre": carpeta.nombre,
                    "cliente": carpeta.cliente.id if carpeta.cliente else None,
                }},
                status=status.HTTP_200_OK
            )


        except Exception as e:
            return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def eliminar_con_forzado(func, path, exc_info):
    print(f"No se pudo eliminar {path}. Error: {exc_info}")
    os.chmod(path, 0o777)  # Cambia los permisos del archivo/carpeta
    func(path)  # Reintenta la operación de eliminación

class EliminarCarpetaView(APIView):
    def delete(self, request, carpeta_id, *args, **kwargs):
        try:
            carpeta = Carpeta.objects.get(id=carpeta_id)
            ruta_carpeta = os.path.join(settings.MEDIA_ROOT, carpeta.url.strip('/'))
            print(f"Ruta física de la carpeta: {ruta_carpeta}")

            # Eliminar la carpeta física
            if os.path.exists(ruta_carpeta):
                shutil.rmtree(ruta_carpeta, onerror=eliminar_con_forzado)
                print(f"Carpeta física eliminada: {ruta_carpeta}")
            else:
                print("La carpeta física no existe.")

            # Eliminar la carpeta de la base de datos
            carpeta.delete()
            print(f"Carpeta eliminada de la base de datos: {carpeta.id}")

            return Response({"mensaje": "Carpeta eliminada exitosamente."}, status=status.HTTP_200_OK)

        except Carpeta.DoesNotExist:
            return Response({"error": "La carpeta no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"error": f"Error al eliminar la carpeta: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


  # Asegúrate de que este modelo exista

@require_GET
def lista_carpetas(request):
    """
    Devuelve una lista de carpetas en formato JSON.
    Incluye una opción especial "Home" con carpeta_id = 0.
    """
    # Obtener todas las carpetas
    carpetas = Carpeta.objects.values('id', 'nombre', 'url')
    
    # Convertir a una lista y agregar "Home" manualmente
    carpetas_list = list(carpetas)
    carpetas_list.insert(0, {'id': 0, 'nombre': 'Home', 'url': 'documentos/'})
    
    # Devolver la lista como JSON
    return JsonResponse(carpetas_list, safe=False)




#///////////////////////////////////////////////////////////////////////////

@api_view(['GET', 'POST'])
def comentario_documento_view(request, documento_id):
    if request.method == 'GET':
        try:
            # Aquí reemplaza con tu lógica para obtener el comentario
            comentario = {
                'id': documento_id,
                'nombre': 'Documento ejemplo',
                'comentario': '',
            }
            return Response(comentario, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        try:
            # Aquí reemplaza con tu lógica para guardar el comentario
            comentario_data = request.data.get('comentario', '')
            if not comentario_data:
                return Response({'error': 'El comentario no puede estar vacío'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Simula guardar el comentario (aquí lo escribirías en tu base de datos)
            return Response({'mensaje': 'Comentario guardado con éxito'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Devuelve una respuesta predeterminada si no se reconoce el método
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
