import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Documento.css';
import SubirArchivo from './SubirArchivo';
import ComentariosModal from './ComentariosModal';
import VistaPreviaArchivo from './VistaPreviaArchivo';
import CrearCarpeta from './CrearCarpeta';
import EditarArchivo from './EditarArchivo';
import EditarCarpeta from './EditarCarpeta';
import BusquedaAvanzada from './BusquedaAvanzada';
import { ExcelIcon, ImageIcon, PdfIcon, PowerPointIcon, WordIcon } from './Icono';


const Documentos = () => {
    const navigate = useNavigate();
    const userName = sessionStorage.getItem('userName');
    const [clientes, setClientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [rutaActual, setRutaActual] = useState('documentos/');
    const [ubicacion, setUbicacion] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarCrearCarpeta, setMostrarCrearCarpeta] = useState(false);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [comentariosModal, setComentariosModal] = useState({ isOpen: false, id: null,tipo:'', comentario: '', titulo: '' });
    const [archivoVistaPrevia, setArchivoVistaPrevia] = useState(null);
    const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
    const [tipoArchivoVistaPrevia, setTipoArchivoVistaPrevia] = useState("");
    const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
    const [mostrarEditarModalCarpeta, setMostrarEditarModalCarpeta] = useState(false);
const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);
const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [filteredDocumentos, setFilteredDocumentos] = useState([]);
const [mostrarBusquedaAvanzada, setMostrarBusquedaAvanzada] = useState(false); 


const fetchDocumentos = async (filtrosAvanzados = {}) => {
    try {
        const baseUrl = `http://localhost:8000/api/Documentos/lista/?ruta=${encodeURIComponent(rutaActual)}`;
        const searchParam = searchTerm.trim() ? `&search=${encodeURIComponent(searchTerm)}` : "";

        // Construcción de filtros avanzados, asegurando que no haya parámetros vacíos
        const filtroParams = Object.entries(filtrosAvanzados)
            .filter(([_, value]) => value) 
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        // URL final con filtros aplicados
        const documentosUrl = `${baseUrl}${searchParam}${filtroParams ? `&${filtroParams}` : ""}`;
        const carpetasUrl = `http://localhost:8000/api/Carpetas/lista/?ruta=${encodeURIComponent(rutaActual)}${searchParam}${filtroParams ? `&${filtroParams}` : ""}`;

        const responseDocs = await fetch(documentosUrl);
        const responseCarpetas = await fetch(carpetasUrl);

        const documentos = await responseDocs.json();
        const carpetas = await responseCarpetas.json();

        // Adaptar carpetas a la estructura esperada
        const carpetasAdaptadas = carpetas
            .filter(carpeta => {
                if (Object.keys(filtrosAvanzados).length > 0) {
                    const camposDocumentos = ['categoria'];
                    const aplicaSoloDocumentos = camposDocumentos.some(campo => filtrosAvanzados[campo]);
                    return !aplicaSoloDocumentos; // Si se filtra por categoría, no incluir carpetas
                }
                if (searchTerm.trim() !== "") {
                    return true; 
                }
                // Mostrar solo carpetas hijas inmediatas si no hay búsqueda
                const carpetaRelativa = carpeta.url.replace(rutaActual, ''); 
                return carpetaRelativa.split('/').filter(Boolean).length === 1;
            })
            .map(carpeta => ({
                id: carpeta.id,
                nombre: carpeta.nombre,
                url: carpeta.url,
                creado_por: carpeta.creado_por,
                categoria: "--",
                cliente: carpeta.cliente,
                fecha_creacion: carpeta.fecha_creacion,
                ultima_modificacion: carpeta.ultima_modificacion,
                comentario: carpeta.comentario,
                tipo: "carpeta",
            }));

        // Adaptar documentos
        const documentosAdaptados = documentos.map(doc => ({
            ...doc,
            tipo: "documento",
        }));

        // Combinar y filtrar
        const elementosCombinados = [...documentosAdaptados, ...carpetasAdaptadas]
            .filter(elemento => elemento.tipo === "documento" || !filtrosAvanzados.categoria) // Excluir carpetas si se filtra por categoría
            .filter(elemento => elemento.url !== rutaActual)
            .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

        setDocumentos(elementosCombinados);
        setFilteredDocumentos(elementosCombinados);
    } catch (error) {
        console.error('Error al obtener documentos:', error);
    }
};


    

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/Clientes/lista/');
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            }
        
        };

        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/usuarios/lista/');
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        
        };

        
        

        fetchClientes();
        fetchUsuarios();
        fetchDocumentos();
        
    }, [rutaActual, searchTerm]);




    const handleVolver = () => {
        if (!rutaActual || rutaActual === 'documentos/') {
            // Si es la raíz, borrar la ubicación
            setUbicacion(0);
            return;
        }
        const partesRuta = (rutaActual || 'documentos/').split('/').filter(Boolean); // Divide la ruta en partes
        partesRuta.pop(); // Elimina la última carpeta
        const nuevaRuta = partesRuta.length > 0 ? partesRuta.join('/') + '/' : 'documentos/';
        setRutaActual(nuevaRuta);
    
        // Si se regresa a la raíz, borrar la ubicación
        if (nuevaRuta === 'documentos/') {
            setUbicacion(0);
        }
    };
    
    
    const verificarPermiso = async (permiso) => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await fetch(`http://localhost:8000/api/Permisos/actuales/?id=${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                throw new Error('Error al verificar permisos');
            }
    
            const permisos = await response.json();
            return permisos[permiso] || false;
        } catch (error) {
            console.error("Error al verificar permisos:", error);
            alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
            return false;
        }
    };
    const clientesAcceso= async(userId) => {
        try{
            const response = await fetch(`http://localhost:8000/api/Permisos/cliente-archivos-ids/?user_id=${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Error al verificar permisos');
        }
        const Acceso=await response.json();
        return Acceso.cliente_archivos_ids;

    } catch (error) {
        console.error("Error al verificar permisos:", error);
        alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
        return false;
    }
};

const obtenerClienteAsociadoDocumento = async (documentoId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/documentos/${documentoId}/cliente/`);
        if (!response.ok) {
            throw new Error("Error al obtener el cliente asociado al documento.");
        }
        const { cliente_id: clienteId } = await response.json();
        return clienteId; // Devuelve el ID del cliente
    } catch (error) {
        console.error("Error al obtener cliente asociado:", error);
        return null; // Devuelve null en caso de error
    }
};

const obtenerClienteAsociadoCarpeta = async (carpetaId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/carpetas/${carpetaId}/cliente/`);
        if (!response.ok) {
            throw new Error("Error al obtener el cliente asociado a la carpeta.");
        }
        const { cliente_id: clienteId } = await response.json();
        return clienteId; // Devuelve el ID del cliente
    } catch (error) {
        console.error("Error al obtener cliente asociado:", error);
        return null; // Devuelve null en caso de error
    }
};

    

    const handleAccederCarpeta =async (carpeta) => {
        setSearchTerm("");
        setFilteredDocumentos(documentos);
        
        const clienteId = await obtenerClienteAsociadoCarpeta(carpeta.id);
        const userId = sessionStorage.getItem("userId");
        const clientesAsociados = await clientesAcceso(userId);
        if (!clientesAsociados) {
            alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
            return;
        }

        if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
            alert("No tienes permisos para acceder a esta carpeta.");
            return;
        }
        if (carpeta && carpeta.url) {
            setRutaActual(carpeta.url);
            setUbicacion(carpeta.id);
        } else {
            console.error("La carpeta no tiene un campo 'url' válido:", carpeta);
        }
    };

    const eliminarDocumento = async (documentoId) => {
        try {
            const clienteId = await obtenerClienteAsociadoDocumento(documentoId);
            
            const tienePermiso = await verificarPermiso("eliminar");
            if (!tienePermiso) {
                alert("No tienes permisos para eliminar documentos.");
                return;
            }
    
            const userId = sessionStorage.getItem("userId");
            const clientesAsociados = await clientesAcceso(userId);
    
            if (!clientesAsociados) {
                alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
                return;
            }
    
            // Verificar si el cliente está asociado
            if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
                alert("No tienes permisos para eliminar este archivo.");
                return;
            }
    
            // Confirmar eliminación
            if (
                window.confirm(`¿Estás seguro de eliminar este documento?`)
            ) {
                const userName = sessionStorage.getItem("userName");
                await fetch(
                    `http://localhost:8000/api/Documentos/${documentoId}/eliminar/?modificado_por=${encodeURIComponent(userName)}`,
                    { method: "DELETE" }
                );
                setDocumentos((prevDocumentos) => prevDocumentos.filter((doc) => doc.id !== documentoId));
                alert("Documento eliminado correctamente.");
            }
        } catch (error) {
            console.error("Error al eliminar documento:", error);
            alert("Hubo un problema al eliminar el documento. Por favor, intenta nuevamente.");
        }
    };
    
    

    const eliminarCarpeta = async (carpetaId) => {
        try {
            const clienteId = await obtenerClienteAsociadoCarpeta(carpetaId);
            const tienePermiso = await verificarPermiso("eliminar");
            if (!tienePermiso) {
                alert("No tienes permisos para eliminar carpetas.");
                return;
            }
    
            const userId = sessionStorage.getItem("userId");
            const clientesAsociados = await clientesAcceso(userId);
    
    
            if (!clientesAsociados) {
                alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
                return;
            }
    
            // Verificar si el cliente está asociado
            if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
                console.log("El cliente de la carpeta no está en la lista de clientes asociados.");
                alert("No tienes permisos para eliminar esta carpeta.");
                return;
            }
    
            // Confirmar eliminación
            if (
                window.confirm(
                    `¿Estás seguro de eliminar esta carpeta? `)
            ) {
                const userName = sessionStorage.getItem("userName");
                const response = await fetch(
                    `http://localhost:8000/api/Carpetas/${carpetaId}/eliminar/?modificado_por=${encodeURIComponent(userName)}`,
                    { method: "DELETE" }
                );
    
                if (!response.ok) {
                    throw new Error("No se pudo eliminar la carpeta.");
                }
    
                // Actualizar el estado para reflejar los cambios
                setDocumentos((prevDocumentos) =>
                    prevDocumentos.filter((elemento) => !(elemento.tipo === "carpeta" && elemento.id === carpetaId))
                );
                alert("Carpeta eliminada correctamente.");
            }
        } catch (error) {
            console.error("Error al eliminar carpeta:", error);
            alert("Hubo un problema al eliminar la carpeta. Por favor, intenta nuevamente.");
        }
    };
    
    

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === "") {
            setFilteredDocumentos(documentos); // Si no hay búsqueda, muestra todos
        } else {
            const lowerTerm = term.toLowerCase();
            const resultados = documentos.filter((item) =>
                item.nombre.toLowerCase().includes(lowerTerm)
            );
            setFilteredDocumentos(resultados);
        }
    };

    useEffect(() => {
        if (!mostrarBusquedaAvanzada) {
            setFilteredDocumentos(documentos);
        }
    }, [documentos, mostrarBusquedaAvanzada]);
    

    const handleLogout = () => {
        localStorage.removeItem('userName');
        navigate('/');
    };

    const getIconForFileType = (fileName) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        switch (fileExtension) {
            case 'docx':
                return <WordIcon />;
            case 'pdf':
                return <PdfIcon/>;
            case 'xlsx':
                return <ExcelIcon/>;
            case 'pptx':
                return <PowerPointIcon/>;
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <ImageIcon/>;
            default:
                return '📄';
        }
    };
    
    const handleAction = async (action, docId) => {

        const tienePermiso = await verificarPermiso('descargar');
    if (!tienePermiso) {
        alert("No tienes permisos para descargar archivos.");
        return;
    }
    const clienteId = await obtenerClienteAsociadoDocumento(docId);
        const userId = sessionStorage.getItem("userId");
        const clientesAsociados = await clientesAcceso(userId);
        if (!clientesAsociados) {
            alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
            return;
        }

        if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
            alert("No tienes permisos para descargar este archivo.");
            return;
        }
        const documento = documentos.find(doc => doc.id === docId);
        if (!documento) {
            console.error("Documento no encontrado");
            return;
        }

        if (action === 'download') {
            const archivoUrl = `http://localhost:8000${documento.archivo}`;
            const link = document.createElement('a');
            link.href = archivoUrl;
            link.download = documento.nombre;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.log(`Acción no manejada: ${action}`);
        }
    };

    
    
    const handleFileSelection = async () => {
        const tienePermiso = await verificarPermiso('subir_archivo');
    if (!tienePermiso) {
        alert("No tienes permisos para subir archivos.");
        return;
    }
    
            // Crear el input para seleccionar el archivo
            const inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) {
        alert("No se seleccionó ningún archivo.");
        return;
    }
                setArchivoSeleccionado(file);
                setMostrarModal(true);
            };
            inputElement.click();
        
    };
    

    const handleComentariosClick = async (id,tipo) => {
        try {
            const endpoint = tipo==="carpeta"
            ?`http://localhost:8000/api/Carpetas/${id}/manejar-comentarios/`
            :`http://localhost:8000/api/Documentos/${id}/manejar-comentarios/`
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Error al obtener comentarios');
            }
            const data = await response.json();

            // Procesar los comentarios como un solo texto
            const comentarios = data.comentarios || [];
            const comentarioTexto = comentarios.join("\n");
            const titulo = comentarios.length > 0 ? 'Ver Comentarios' : 'Añadir Comentario';

            setComentariosModal({
                isOpen: true,
                id,
                tipo,
                comentario: comentarioTexto, // Se pasa como texto plano al modal
                titulo,
            });
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        }
    };


    const closeComentariosModal = () => {
        setComentariosModal({ isOpen: false, id: null, tipo:'', comentario: '', titulo: '' });
    };

    const renderComentariosLink = (doc) => (
        <a href="#!" onClick={() => handleComentariosClick(doc.id, doc.tipo)}>
            {doc.comentario ? 'Ver' : 'Añadir'}
        </a>
    );

    

    const handleVerArchivo = async (doc) => {
        const tienePermiso = await verificarPermiso('ver');
    if (!tienePermiso) {
        alert("No tienes permisos para ver archivos.");
        return;
    }
    const clienteId = await obtenerClienteAsociadoDocumento(doc.id);
    const userId = sessionStorage.getItem("userId");
    const clientesAsociados = await clientesAcceso(userId)
    if (!clientesAsociados) {
        alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
        return;
    }
    if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
        alert("No tienes permisos para ver este archivo.");
        return;
    }
        const extensionesPermitidas = ["docx", "pptx", "pdf", "xlsx", "txt", "png", "jpg", "jpeg"];
        const extension = doc.archivo.split(".").pop().toLowerCase();
        
        if (extensionesPermitidas.includes(extension)) {
            const baseUrl = "http://localhost:5500";
            setArchivoVistaPrevia(`${baseUrl}${doc.archivo}`);
            setTipoArchivoVistaPrevia(extension);
            setMostrarVistaPrevia(true);
        } else {
            alert("Este tipo de archivo no se puede mostrar.");
        }
    };

    const handleEditarClick = async (documento) => {
        const tienePermiso = await verificarPermiso('editar');
    if (!tienePermiso) {
        alert("No tienes permisos para editar archivos.");
        return;
    }
    const clienteId = await obtenerClienteAsociadoDocumento(documento.id);
    const userId = sessionStorage.getItem("userId");
    const clientesAsociados = await clientesAcceso(userId);

    if (!clientesAsociados) {
        alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
        return;
    }

    if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
        console.log("El cliente del documento no está en la lista de clientes asociados.");
        alert("No tienes permisos para editar este archivo.");
        return;
    }

        setDocumentoSeleccionado(documento);
        setMostrarEditarModal(true);
    };

    const handleEditarCarpeta = async (carpeta) => {
        const tienePermiso = await verificarPermiso('editar');
    if (!tienePermiso) {
        alert("No tienes permisos para editar carpetas.");
        return;
    }
    const clienteId = await obtenerClienteAsociadoCarpeta(carpeta.id);
    const userId = sessionStorage.getItem("userId");
    const clientesAsociados = await clientesAcceso(userId);

    if (!clientesAsociados) {
        alert("Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.");
        return;
    }

    if (clientesAsociados.length > 0 && !clientesAsociados.includes(clienteId)) {
        console.log("El cliente del documento no está en la lista de clientes asociados.");
        alert("No tienes permisos para editar esta carpeta.");
        return;
    }
        setCarpetaSeleccionada(carpeta);
        setMostrarEditarModalCarpeta(true); 
    };

    const handleFiltrar = () => {
        setMostrarBusquedaAvanzada(true); // Mostrar modal de búsqueda avanzada
    };

    const handleCerrarBusquedaAvanzada = () => {
        setMostrarBusquedaAvanzada(false); // Cerrar modal de búsqueda avanzada
    };

    const handleFiltrosAvanzados = (filtros) => {
        fetchDocumentos(filtros);
    };
    
    const handleCrearCarpeta = async () => {
        const tienePermiso = await verificarPermiso('crear_carpeta');
        if (!tienePermiso) {
            alert("No tienes permisos para crear carpetas.");
            return;
        } setMostrarCrearCarpeta(true);
    };

    const handleUbicacionClick = (doc) => {
        const ubicacion = doc.tipo === "carpeta" 
            ? { mensaje: `La ruta es: ${doc.url}` } 
            : { mensaje: `La ruta es: ${doc.archivo}` };
    
        console.log(ubicacion); // Esto mostrará el JSON en la consola del navegador
        alert(JSON.stringify(ubicacion, null, 2)); // Opcional: Mostrar en una alerta
    };

    const handleDropdownPosition = (event) => {
        const dropdownContent = event.currentTarget.querySelector(".dropdown-content");
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
    
        // Ajusta la posición del dropdown según su espacio disponible
        if (rect.bottom + dropdownContent.offsetHeight > viewportHeight) {
            dropdownContent.style.top = `${rect.top - dropdownContent.offsetHeight}px`;
        } else {
            dropdownContent.style.top = `${rect.bottom}px`;
        }
        dropdownContent.style.left = `${rect.left}px`;
        dropdownContent.style.display = "block"; // Asegura que se muestre
    };
    
    // Llama a esta función en cada dropdown cuando se haga hover o clic
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.addEventListener("mouseenter", handleDropdownPosition);
        dropdown.addEventListener("mouseleave", () => {
            const dropdownContent = dropdown.querySelector(".dropdown-content");
            dropdownContent.style.display = "none";
        });
    });
    
    
        const renderAccion = (doc) => {
            
            
        if (doc.tipo === "carpeta") {
            return (
                <div className="dropdown" nMouseEnter={handleDropdownPosition}>
                    <button className="btn-dropdown" onClick={() => handleAccederCarpeta(doc)}>Acceder</button>
                    <div className="dropdown-content">
                        <button onClick={() => handleEditarCarpeta(doc)}>Editar</button>
                        <button onClick={() => handleUbicacionClick(doc)}>Ubicación</button>
                        <button onClick={() => eliminarCarpeta(doc.id)} className="boton-accion boton-eliminar">Eliminar</button>
                    </div>
                </div>
            );
        }
        return (
            <div className="dropdown" nMouseEnter={handleDropdownPosition}>
                <button className="btn-dropdown" onClick={() => handleVerArchivo(doc)}>Ver</button>
                <div className="dropdown-content">
                    <button onClick={() => handleEditarClick(doc)}>Editar</button>
                    <button onClick={() => handleAction('download', doc.id)}>Descargar</button>
                    <button onClick={() => handleUbicacionClick(doc)} >Ubicación</button>
                    <button onClick={() => eliminarDocumento(doc.id)} className="boton-accion boton-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        );
    };
            

    return (
        <div className="documentos-container">
            <h1 className="Bienvenida">Bienvenido al sistema de gestion de documentos PDGR!!!</h1>
            <p className="Informacion">Hola {userName}, aqui podra subir sus archivos y gestionarlos como le plazaca.</p>
<p className="Informacion">Nota: Si no puede realizar una accion en especifico, probablemente sea por falta de permisos, por favor comuniquese con el administrador.</p>
            <div className='botones-container'>
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>

                <button onClick={handleFileSelection} className="btn-subir-archivo">
                    Subir Archivo
                </button>
                <button onClick={handleCrearCarpeta} className='btn-crear-carpeta'>
                    Crear Carpeta
                </button>

                {rutaActual !== 'documentos/' && (
                <button onClick={handleVolver} className="btn-volver">
                    &larr; Volver
                </button>
            )}

            </div>

            <div className="search-bar-container">
    <input
        type="text"
        placeholder="Buscar documentos o carpetas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
    />
    <button onClick={handleFiltrar} className="btn-filtrar">Filtrar</button>
</div>
{mostrarBusquedaAvanzada && (
                <BusquedaAvanzada
                    clientes={clientes}
                    usuarios={usuarios}
                    onClose={handleCerrarBusquedaAvanzada} 
                    onBuscar={handleFiltrosAvanzados}/>)}

            {mostrarModal && (
                <SubirArchivo
                    userName={userName}
                    clientes={clientes}
                    archivo={archivoSeleccionado}
                    rutaActual={rutaActual}
                    ubicacion={ubicacion}
                    onClose={() => setMostrarModal(false)}
                    onUploadSuccess={fetchDocumentos}
                />
            )}
        <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered">
                
                    <thead className="thead-light">
                        <tr>
                            <th>Acción</th>
                            <th class="scrollable">Nombre</th>
                            <th class="scrollable">Subido Por</th>
                            <th class="scrollable">Categoría</th>
                            <th class="scrollable">Cliente</th>
                            <th>Fecha de Creación</th>
                            <th>Última Modificación</th>
                            <th>Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocumentos.length > 0 ? (
                            filteredDocumentos.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{renderAccion(doc)}</td>
                                    <td className="scrollable">
                                    {doc.tipo === "carpeta" ? "📁" : getIconForFileType(doc.nombre)}{" "} {doc.nombre}
                                    </td>
                                    
                                    <td className="scrollable">{doc.creado_por}</td>
                                    <td class="scrollable">{doc.categoria}</td>
                                    <td className="scrollable">{doc.cliente}</td>
                                    <td>{new Date(doc.fecha_creacion).toLocaleString()}</td>
                                    <td>{new Date(doc.ultima_modificacion).toLocaleString()}</td>
                                    <td>
                                    {renderComentariosLink(doc)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No hay documentos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                    
                </table>
            </div>
            <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Gestión Documental - Todos los derechos reservados.</p>
        </footer>
            {mostrarVistaPrevia && (
                <VistaPreviaArchivo
                    isOpen={mostrarVistaPrevia}
                    onClose={() => setMostrarVistaPrevia(false)}
                    file={archivoVistaPrevia}
                    fileType={tipoArchivoVistaPrevia}
                />
            )}
            {comentariosModal.isOpen && (
                <ComentariosModal
                    isOpen={comentariosModal.isOpen}
                    id={comentariosModal.id}
                    tipo={comentariosModal.tipo}
                    comentario={comentariosModal.comentario}
                    titulo={comentariosModal.titulo}
                    onClose={closeComentariosModal}
                    onUpdate={fetchDocumentos}
                />
            )}
          

{mostrarCrearCarpeta && (
    <CrearCarpeta
    rutaActual={rutaActual}
        userName={userName}
        clientes={clientes}
        ubicacion={ubicacion}
        onClose={() => setMostrarCrearCarpeta(false)}
        onUploadSuccess={fetchDocumentos}
    />
)}
 {mostrarEditarModal && (
                <EditarArchivo
                    
                    userName={userName}
                    clientes={clientes}
                    documento={documentoSeleccionado}
                    onClose={() => setMostrarEditarModal(false)}
                    onEditSuccess={fetchDocumentos}
                />
            )}
{mostrarEditarModalCarpeta && (
                <EditarCarpeta
                    
                    userName={userName}
                    clientes={clientes}
                    carpeta={carpetaSeleccionada}
                    onClose={() => setMostrarEditarModalCarpeta(false)}
                    onEditSuccess={() => {
                        fetchDocumentos(); // Refresca los datos después de editar una carpeta
                    }}
                />
            )}

        </div>
    );
};

export default Documentos;
