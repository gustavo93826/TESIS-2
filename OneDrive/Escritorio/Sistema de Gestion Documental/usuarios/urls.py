from django.urls import path
from . import views

urlpatterns = [
    path("usuarios/", views.lista_usuarios, name="lista_usuarios"),
    path("usuarios/<int:usuario_id>/editar/", views.Editar_usuario),
    path("usuarios/<int:usuario_id>/eliminar/", views.eliminar_usuario, name="eliminar_usuario"),
    path("usuarios/crear/", views.crear_usuario, name="crear_usuario"),
    path("usuarios/lista/", views.lista_usuarios_opcion, name="lista_usuarios_opcion"),
    
]
