from django.urls import path
from .views import listar_permisos, obtener_permisos, actualizar_permisos_clientes, permisos_cliente, obtener_ids_clientes_archivos

urlpatterns = [
    path('Permisos/lista/', listar_permisos, name='listar_permisos'),
    path('Permisos/actuales/',obtener_permisos, name='actuales'),
    path('Permisos/cliente/', permisos_cliente, name='permisos_cliente'),
    path('Permisos/actualizar-clientes/', actualizar_permisos_clientes, name='actualizar-clientes'),
    path('Permisos/cliente-archivos-ids/', obtener_ids_clientes_archivos, name='cliente_archivos_ids'),
]
