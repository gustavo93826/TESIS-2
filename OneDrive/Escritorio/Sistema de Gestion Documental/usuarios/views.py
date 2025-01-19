from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.utils.timezone import now
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Usuario
import json
import secrets
import string

# Endpoint para listar usuarios
def lista_usuarios(request):
    if request.method == "GET":
        usuarios = Usuario.objects.all().values("id", "nombre", "email", "rol", "fecha_creacion")
        return JsonResponse(list(usuarios), safe=False)

# Endpoint para eliminar usuario
@csrf_exempt
def eliminar_usuario(request, usuario_id):
    if request.method == "DELETE":
        usuario = get_object_or_404(Usuario, id=usuario_id)
        usuario.delete()
        return JsonResponse({"mensaje": "Usuario eliminado correctamente."})

# Función para enviar correos
def enviar_correo_usuario(email, nombre, contrasena_aleatoria):
    asunto = "¡Usuario creado en el sistema!"
    mensaje = f"""
    Hola {nombre},

    Se ha creado un usuario para ti en el sistema. 
    Tu correo registrado es: {email}.
    Tu contraseña predeterminada es: {contrasena_aleatoria}.

    Por favor, cámbiala después de iniciar sesión.

    Saludos,
    El equipo del sistema
    """
    remitente = 'gustavoalbertohm@gmail.com'  
    destinatario = [email]
    try:
        send_mail(asunto, mensaje, remitente, destinatario)
        return True
    except Exception as e:
        print("Error al enviar el correo:", e)
        return False


def generar_contraseña_temporal(longitud=16):
    
    if longitud < 3:
        raise ValueError("La longitud de la contraseña debe ser al menos 3 caracteres.")

    caracteres = string.ascii_letters + string.digits
    primera_mayuscula = secrets.choice(string.ascii_uppercase)  # Primera letra mayúscula
    ultima_mayuscula = secrets.choice(string.ascii_uppercase)  # Última letra mayúscula
    aleatoria = ''.join(secrets.choice(caracteres) for _ in range(longitud - 2))

    return primera_mayuscula + aleatoria + ultima_mayuscula

# Endpoint para crear usuario
@csrf_exempt
def crear_usuario(request):
    if request.method == "POST":
        try:
            datos = json.loads(request.body)
            nombre = datos.get('nombre')
            email = datos.get('email')
            rol = datos.get('rol')

            if not nombre or not email or not rol:
                return JsonResponse({"error": "Todos los campos son obligatorios."}, status=400)
            
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({"error": "El correo proporcionado no es válido."}, status=400)

            if Usuario.objects.filter(email=email).exists():
                return JsonResponse({"error": "Ya existe un usuario registrado con este correo."}, status=400)

                        
            contrasena_aleatoria = generar_contraseña_temporal()
            
            # Crear usuario en la base de datos
            usuario = Usuario.objects.create(
                nombre=nombre,
                email=email,
                rol=rol,
                password='',
                temp_password=contrasena_aleatoria, 
                fecha_creacion=now()
            )

    
            enviar_correo_usuario(email, nombre, contrasena_aleatoria)

            # Devolver datos completos del usuario creado
            return JsonResponse({
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "contrasena_aleatoria":contrasena_aleatoria,
                "rol": usuario.rol,
                "fecha_creacion": usuario.fecha_creacion.strftime('%Y-%m-%d %H:%M:%S')  # Formatear fecha
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "El cuerpo de la solicitud debe estar en formato JSON."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)



@csrf_exempt
def Editar_usuario(request, usuario_id):
    if request.method == "PUT":
        try:
            usuario = get_object_or_404(Usuario, id=usuario_id)
            datos = json.loads(request.body)

            nombre = datos.get('nombre')
            email = datos.get('email')
            rol = datos.get('rol')

            if not nombre or not email or not rol:
                return JsonResponse({"error": "Todos los campos son obligatorios."}, status=400)

            # Actualizar los datos del usuario
            usuario.nombre = nombre
            usuario.email = email
            usuario.rol = rol
            usuario.save()

            return JsonResponse({
                "id": usuario.id,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "rol": usuario.rol,
                "fecha_creacion": usuario.fecha_creacion.strftime('%Y-%m-%d %H:%M:%S')
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "El cuerpo de la solicitud debe estar en formato JSON."}, status=400)

    return JsonResponse({"error": "Método no permitido."}, status=405)

def lista_usuarios_opcion(request):
    if request.method == "GET":
        # Filtrar usuarios con los roles específicos
        roles_permitidos = [2, 3, 4]  # Abogado, Auxiliar Administrativo, Asistente
        usuarios = Usuario.objects.filter(rol__in=roles_permitidos).values("id", "nombre", "email", "rol")
        return JsonResponse(list(usuarios), safe=False)