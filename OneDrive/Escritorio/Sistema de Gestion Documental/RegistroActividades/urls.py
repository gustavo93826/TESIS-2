from django.urls import path
from .views import obtener_registros, borrar_registros

urlpatterns = [
    
    path('registros/', obtener_registros, name='obtener_registros'),
    path("registros/borrar/", borrar_registros, name="borrar_registros"),
]
