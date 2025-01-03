from django.urls import path
from . import views


urlpatterns = [
    path("Clientes/", views.lista_clientes, name="lista_clientes"),
    path("Clientes/<int:cliente_id>/editar/", views.Editar_cliente),
    path("Clientes/<int:cliente_id>/eliminar/", views.eliminar_cliente, name="eliminar_cliente"),
    path("Clientes/crear/", views.agregar_cliente, name="agregar_cliente"),
    path("Clientes/lista/", views.lista_opciones, name="lista_opciones"),
    
]
