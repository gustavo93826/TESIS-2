from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from usuarios.models import Usuario
from django.core.mail import send_mail, EmailMessage
import uuid
from datetime import datetime, timedelta
from rest_framework.response import Response
import pytz
from django.utils import timezone

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from usuarios.models import Usuario

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'error': 'Se requieren email y contraseña'}, status=400)
            
            try:
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

            # Verificar si la contraseña ingresada es temporal
            if user.temp_password and user.temp_password == password and not user.password:
                return JsonResponse({'status': 'reset_required'}, status=200)

            # Verificar si la contraseña ingresada es la del campo password
            if user.password == password:
                redirigir = '/admin' if user.rol == 1 else '/user'
                return JsonResponse({
                    'rol': user.rol,
                    'redirigir': redirigir,
                    'nombre': user.nombre  # Incluye el nombre del usuario
                }, status=200)

            return JsonResponse({'error': 'Credenciales inválidas'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de datos no válido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error interno: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Método no permitido. Usa POST.'}, status=405)


@csrf_exempt
def Establecer_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            temp_password = data.get('temp_password')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            if not email or not temp_password or not new_password or not confirm_password:
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            if new_password != confirm_password:
                return JsonResponse({'error': 'Las contraseñas no coinciden'}, status=400)

            try:
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

            if user.temp_password != temp_password:
                return JsonResponse({'error': 'Contraseña temporal incorrecta'}, status=401)

            # Actualizar la contraseña del usuario
            user.password = new_password
            user.temp_password = None  # Eliminamos la contraseña temporal
            user.save()

            return JsonResponse({'message': 'Contraseña actualizada correctamente', 'redirect': '/user'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de datos no válido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error interno: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Método no permitido. Usa POST.'}, status=405)






@csrf_exempt
def Recuperar_password(request):
    if request.method == 'POST':
        try:
            # Obtener el correo del body
            data = json.loads(request.body)
            email = data.get('email')

            # Validar que se proporcionó el correo
            if not email:
                return JsonResponse({'error': 'Se requiere un correo electrónico'}, status=400)

            try:
                # Verificar si el correo existe en la base de datos
                user = Usuario.objects.get(email=email)

                # Generar un token y su expiración
                user.reset_token = uuid.uuid4()
                user.reset_token_expiration = datetime.now() + timedelta(hours=1)
                user.save()

                # Generar mensaje de recuperación
                asunto = "¡Cambio de Contraseña!"
                mensaje = f"""
                            <!DOCTYPE html>
                        <html>
                        <head>
                        <style>
                        .button:hover {{
                            background-color: #0056b3;
                            }}
                        </style>
                        </head>
                        <body>
                    <p>Hola {user.nombre},</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el Sistema de Gestión Documental PDGR.</p>
                    <p>Para cambiar tu contraseña, haz clic en el siguiente botón:</p>
                    <p>
                    <a href="http://localhost:3000/Cambiar_password/?token={user.reset_token}"  
                style="display: inline-block; 
                  padding: 10px 20px; 
                  font-size: 16px; 
                  color: #ffffff; 
                  background-color: #007bff; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  text-align: center; 
                  font-weight: bold;">
                Cambiar Contraseña
                 </a>
                    </p>
                    <p>Si no has solicitado un cambio de contraseña, puedes ignorar este mensaje. Por motivos de seguridad, este enlace expirará en 1 hora.</p>
                    <p>Atentamente,<br>El equipo de soporte del Sistema de Gestión Documental</p>
                    </body>
                    </html>
                            """
                
                remitente = 'gustavoalbertohm@gmail.com'
                destinatario = [email]
                Correo = EmailMessage(asunto, mensaje, remitente, destinatario)
                Correo.content_subtype = "html"
                Correo.send()

                # Respuesta indicando éxito
                return JsonResponse({
                    'message': f'Se ha enviado un correo electrónico a {email} con instrucciones para recuperar tu contraseña.'
                }, status=200)

            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'El correo no está registrado'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de datos no válido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error interno: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Método no permitido. Usa POST.'}, status=405)






@csrf_exempt
def Cambiar_password(request):
    if request.method == 'POST':
        try:
            # Obtener los datos enviados desde el frontend
            data = json.loads(request.body)
            email = data.get('email')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            # Validar que los campos requeridos no estén vacíos
            if not email or not new_password or not confirm_password:
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

            # Validar que la nueva contraseña y su confirmación coincidan
            if new_password != confirm_password:
                return JsonResponse({'error': 'Las contraseñas no coinciden'}, status=400)

            # Validar longitud mínima de contraseña
            if len(new_password) < 8:
                return JsonResponse({'error': 'La contraseña debe tener al menos 8 caracteres'}, status=400)

            # Buscar el usuario en la base de datos
            try:
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

            # Actualizar la contraseña del usuario
            user.password = new_password
            user.save()

            return JsonResponse({'message': 'Contraseña actualizada correctamente'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de datos no válido'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error interno: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Método no permitido. Usa POST.'}, status=405)



@csrf_exempt
def Validar_token(request):
    if request.method == 'GET':
        try:
            # Obtener el token enviado por la URL
            token = request.GET.get('token')

            if not token:
                return JsonResponse({'error': 'Se requiere un token'}, status=400)

            try:
                # Buscar el usuario con el token
                user = Usuario.objects.get(reset_token=token)

                # Zona horaria local
                local_tz = pytz.timezone('America/Caracas')

                # Obtener la hora actual en UTC y convertirla a la zona horaria local
                current_time = datetime.now(pytz.utc).astimezone(local_tz)

                # Si la expiración del token es un valor nulo o mal formado, corregirlo
                if not user.reset_token_expiration:
                    return JsonResponse({'error': 'El token no tiene una fecha de expiración válida'}, status=400)

                # Convertir la fecha de expiración del token a la zona horaria local
                token_expiration = user.reset_token_expiration.astimezone(local_tz)

                # Verificar si el token ha expirado
                if current_time > token_expiration:
                    return JsonResponse({'error': 'El enlace ha expirado'}, status=400)

                # Token válido
                return JsonResponse({'message': 'Token válido'}, status=200)

            except Usuario.DoesNotExist:
                return JsonResponse({'error': 'Token inválido'}, status=404)

        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error interno: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Método no permitido. Usa GET.'}, status=405)
