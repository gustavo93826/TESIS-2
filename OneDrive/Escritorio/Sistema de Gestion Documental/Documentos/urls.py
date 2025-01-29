from django.urls import path
from .views import DocumentoUploadView, DocumentoListView, eliminar_documento, CrearCarpetaView, DocumentoUpdateView, CarpetaListView, CarpetaUpdateView, EliminarCarpetaView, obtener_cliente_asociado, obtener_cliente_asociado_carpeta, manejar_comentarios, manejar_comentarios_carpeta, lista_carpetas, lista_documentos

urlpatterns = [
    path('Documentos/subir_documento/', DocumentoUploadView.as_view(), name='subir_documento'),
    path('Documentos/lista/', DocumentoListView.as_view(), name='documentos-lista'),
    path('Documentos/<int:documento_id>/eliminar/', eliminar_documento, name='eliminar_documento'),
    path('Documentos/crear-carpeta/', CrearCarpetaView.as_view(), name='crear_carpeta'),
    path('Documentos/<int:documento_id>/editar/', DocumentoUpdateView.as_view(), name='editar_documento'),
    path('Carpetas/lista/', CarpetaListView.as_view(), name='carpetas-lista'),
    path('Carpetas/<int:carpeta_id>/editar/', CarpetaUpdateView.as_view(), name='carpetas-updated'),
    path('Carpetas/<int:carpeta_id>/eliminar/', EliminarCarpetaView.as_view(), name='eliminar_carpeta'),
    path('documentos/<int:documento_id>/cliente/', obtener_cliente_asociado, name='obtener_cliente_asociado'),
    path('carpetas/<int:carpeta_id>/cliente/', obtener_cliente_asociado_carpeta, name='obtener_cliente_asociado_carpeta'),
    path('Documentos/<int:documento_id>/manejar-comentarios/', manejar_comentarios, name='manejar_comentarios'),
    path('Carpetas/<int:carpeta_id>/manejar-comentarios/', manejar_comentarios_carpeta, name='manejar_comentarios_carpeta'),
    path('Documentos/lista_opciones/',lista_documentos, name='lista_documentos'),
    path('Carpetas/lista_opciones/',lista_carpetas, name='lista_carpetas'),
]
