from django.shortcuts import render
from .models import Cliente
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.validators import RegexValidator
from django.views.decorators.http import require_GET
import json

def lista_clientes(request):
    if request.method == "GET":
        clientes = Cliente.objects.exclude(id=100).values("id", "nombre", "correo", "telefono", "direccion")
        return JsonResponse(list(clientes), safe=False)


@csrf_exempt
def eliminar_cliente(request, cliente_id):
    if request.method == "DELETE":
        cliente = get_object_or_404(Cliente, id=cliente_id)
        cliente.delete()
        return JsonResponse({"mensaje": "Cliente eliminado correctamente."})
    

@csrf_exempt
def agregar_cliente(request):
    if request.method == "POST":
        try:
            datos = json.loads(request.body)
            nombre = datos.get('nombre')
            correo = datos.get('correo')
            telefono = datos.get('telefono')
            direccion = datos.get('direccion')

            # Validaciones
            if not nombre:
                return JsonResponse({"error": "El campo 'nombre' es obligatorio."}, status=400)
            
            if correo:
                try:
                    validate_email(correo)
                except ValidationError:
                    return JsonResponse({"error": "El correo proporcionado no es válido."}, status=400)

            if telefono:
                try:
                    # Validación adicional de teléfono
                    regex_validator = RegexValidator(
                        regex=r'^\+?1?\d{9,15}$', 
                        message="El número de teléfono debe estar en el formato: '+999999999'. Hasta 15 dígitos permitidos."
                    )
                    regex_validator(telefono)
                except ValidationError as e:
                    return JsonResponse({"error": str(e)}, status=400)

            # Crear cliente
            cliente = Cliente.objects.create(
                nombre=nombre,
                correo=correo,
                telefono=telefono,
                direccion=direccion
            )

            return JsonResponse({
                "id": cliente.id,
                "nombre": cliente.nombre,
                "correo": cliente.correo,
                "telefono": cliente.telefono,
                "direccion": cliente.direccion
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "El cuerpo de la solicitud debe estar en formato JSON."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)


@csrf_exempt
def Editar_cliente(request, cliente_id):
    if request.method == "PUT":
        try:
            cliente = get_object_or_404(Cliente, id=cliente_id)
            datos = json.loads(request.body)

            nombre = datos.get('nombre')
            correo = datos.get('correo')
            telefono = datos.get('telefono')
            direccion = datos.get('direccion')

            if not nombre:
                return JsonResponse({"error": "Un cliente no puede estar sin nombre."}, status=400)

            # Actualizar los datos del cliente
            cliente.nombre = nombre
            cliente.correo = correo
            cliente.telefono = telefono
            cliente.direccion = direccion
            cliente.save()

            return JsonResponse({
                "id": cliente.id,
                "nombre": cliente.nombre,
                "correo": cliente.correo,
                "telefono": cliente.telefono,
                "direccion": cliente.direccion
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "El cuerpo de la solicitud debe estar en formato JSON."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)




@require_GET
def lista_opciones(request):
    clientes = Cliente.objects.exclude(id=100).values('id', 'nombre')  # Selecciona los campos necesarios
    return JsonResponse(list(clientes), safe=False)