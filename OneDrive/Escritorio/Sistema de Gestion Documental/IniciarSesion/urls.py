from django.urls import path
from .views import login, Establecer_password, Recuperar_password, Cambiar_password, Validar_token

urlpatterns = [
    path('login/', login, name='login'),
    path('Establecer_password/', Establecer_password, name='Establecer_password'),
    path('Recuperar_password/', Recuperar_password, name='Recuperar_password'),
    path('Cambiar_password/', Cambiar_password, name='Cambiar_password'),
    path('Validar_token/', Validar_token, name='Validar_token'),
    
]
