from django.urls import path
from .views import DocumentoUploadView, DocumentoListView, comentario_documento_view,eliminar_documento, CrearCarpetaView, DocumentoUpdateView, CarpetaListView, CarpetaUpdateView, EliminarCarpetaView

urlpatterns = [
    path('Documentos/subir_documento/', DocumentoUploadView.as_view(), name='subir_documento'),
    path('Documentos/lista/', DocumentoListView.as_view(), name='documentos-lista'),
    path('Documentos/<int:documento_id>/comentario/', comentario_documento_view, name='comentario_documento'),
    path('Documentos/<int:documento_id>/eliminar/', eliminar_documento, name='eliminar_documento'),
    path('Documentos/crear-carpeta/', CrearCarpetaView.as_view(), name='crear_carpeta'),
    path('Documentos/<int:documento_id>/editar/', DocumentoUpdateView.as_view(), name='editar_documento'),
    path('Carpetas/lista/', CarpetaListView.as_view(), name='carpetas-lista'),
    path('Carpetas/<int:carpeta_id>/editar/', CarpetaUpdateView.as_view(), name='carpetas-updated'),
    path('Carpetas/<int:carpeta_id>/eliminar/', EliminarCarpetaView.as_view(), name='eliminar_carpeta'),

    
]
