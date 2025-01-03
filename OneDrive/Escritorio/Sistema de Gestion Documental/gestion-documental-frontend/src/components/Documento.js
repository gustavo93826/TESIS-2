import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Documento.css';
import SubirArchivo from './SubirArchivo';
import ComentariosModal from './ComentariosModal';
import VistaPreviaArchivo from './VistaPreviaArchivo';
import CrearCarpeta from './CrearCarpeta';
import EditarArchivo from './EditarArchivo';
import EditarCarpeta from './EditarCarpeta';
import { ExcelIcon, ImageIcon, PdfIcon, PowerPointIcon, WordIcon } from './Icono';


const Documentos = () => {
    const navigate = useNavigate();
    const userName = sessionStorage.getItem('userName');
    const [clientes, setClientes] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [rutaActual, setRutaActual] = useState('documentos/');
    const [ubicacion, setUbicacion] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarCrearCarpeta, setMostrarCrearCarpeta] = useState(false);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [comentariosModal, setComentariosModal] = useState({ isOpen: false, documentoId: null, comentario: '', titulo: '' });
    const [archivoVistaPrevia, setArchivoVistaPrevia] = useState(null);
    const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
    const [tipoArchivoVistaPrevia, setTipoArchivoVistaPrevia] = useState("");
    const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
    const [mostrarEditarModalCarpeta, setMostrarEditarModalCarpeta] = useState(false);
const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);
const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [filteredDocumentos, setFilteredDocumentos] = useState([]);


    const fetchDocumentos = async () => {
        try {
        const baseUrl = `http://localhost:8000/api/Documentos/lista/?ruta=${rutaActual}`;
        const searchParam = searchTerm.trim() !== "" ? `&search=${encodeURIComponent(searchTerm)}` : "";
        const responseDocs = await fetch(`${baseUrl}${searchParam}`);
        const responseCarpetas = await fetch(`http://localhost:8000/api/Carpetas/lista/?ruta=${rutaActual}${searchParam}`);
            const documentos = await responseDocs.json();
            const carpetas = await responseCarpetas.json();
            const carpetasAdaptadas = carpetas
            .filter(carpeta => {
                if (searchTerm.trim() !== "") {
                    // Cuando hay búsqueda, no filtrar por rutas hijas
                    return true;
                }
                // Solo mostrar carpetas hijas inmediatas si no hay búsqueda
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
                privacidad: "--",
                fecha_creacion: carpeta.fecha_creacion,
                ultima_modificacion: carpeta.ultima_modificacion,
                tipo: "carpeta", // Identificador para diferenciar de documentos
            }));
            const documentosAdaptados = documentos.map(doc => ({
                ...doc,
                tipo: "documento", // Identificador para diferenciar de carpetas
            }));
            const elementosCombinados = [...carpetasAdaptadas, ...documentosAdaptados]
            .filter(elemento => elemento.url !== rutaActual)
            .sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
            
            setDocumentos(elementosCombinados);
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
        

        fetchClientes();
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
    
    

    const handleAccederCarpeta = (carpeta) => {
        if (carpeta && carpeta.url) {
            setRutaActual(carpeta.url);
            setUbicacion(carpeta.id);
        } else {
            console.error("La carpeta no tiene un campo 'url' válido:", carpeta);
        }
    };

    const eliminarDocumento = async (documentoId) => {
        if (window.confirm("¿Estás seguro de eliminar este documento?")) {
            try {
                await fetch(`http://localhost:8000/api/Documentos/${documentoId}/eliminar/`, {
                    method: "DELETE",
                });
                setDocumentos(documentos.filter((documento) => documento.id !== documentoId));
            } catch (error) {
                console.error("Error al eliminar documento:", error);
            }
        }
    };

    const eliminarCarpeta = async (carpetaId) => {
        if (window.confirm(`¿Estás seguro de eliminar la carpeta con ID ${carpetaId}?`)) {
            try {
                const response = await fetch(`http://localhost:8000/api/Carpetas/${carpetaId}/eliminar/`, {
                    method: "DELETE", 
                });
    
                if (!response.ok) {
                    throw new Error("No se pudo eliminar la carpeta.");
                }
    
                // Actualiza el estado local para reflejar el cambio
                setDocumentos(documentos.filter((elemento) => !(elemento.tipo === "carpeta" && elemento.id === carpetaId)));
            } catch (error) {
                console.error("Error al eliminar carpeta:", error);
                alert("Ocurrió un error al intentar eliminar la carpeta.");
            }
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
        setFilteredDocumentos(documentos);
    }, [documentos]);
    

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
    
    const handleAction = (action, docId) => {
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

    
    

    const handleFileSelection = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.onchange = (event) => {
            const file = event.target.files[0];
            setArchivoSeleccionado(file);
            setMostrarModal(true);
        };
        inputElement.click();
    };

    const handleComentariosClick = async (documentoId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/Documentos/${documentoId}/comentario/`);
            const data = await response.json();
            const comentario = data.comentario || '';
            const titulo = `${comentario.split('\n').length || 0} comentario(s)`;
            setComentariosModal({ isOpen: true, documentoId, comentario, titulo });
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        }
    };

    const closeComentariosModal = () => {
        setComentariosModal({ isOpen: false, documentoId: null, comentario: '', titulo: '' });
    };

    

    const handleVerArchivo = (doc) => {
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

    const handleEditarClick = (documento) => {
        setDocumentoSeleccionado(documento);
        setMostrarEditarModal(true);
    };

    const handleEditarCarpeta = (carpeta) => {
        setCarpetaSeleccionada(carpeta);
        setMostrarEditarModalCarpeta(true); 
    };

    
        const renderAccion = (doc) => {
        if (doc.tipo === "carpeta") {
            return (
                <div className="dropdown">
                    <button className="btn-dropdown" onClick={() => handleAccederCarpeta(doc)}>Acceder</button>
                    <div className="dropdown-content">
                        <button onClick={() => handleEditarCarpeta(doc)}>Editar</button>
                        <button onClick={() => eliminarCarpeta(doc.id)} >Eliminar</button>
                    </div>
                </div>
            );
        }
        return (
            <div className="dropdown">
                <button className="btn-dropdown" onClick={() => handleVerArchivo(doc)}>Ver</button>
                <div className="dropdown-content">
                    <button onClick={() => handleEditarClick(doc)}>Editar</button>
                    <button onClick={() => handleAction('download', doc.id)}>Descargar</button>
                    <button >Mover</button>
                    <button onClick={() => eliminarDocumento(doc.id)} className="boton-accion boton-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        );
    };
            

    return (
        <div className="documentos-container">
            <h1>Bienvenido {userName}, aquí podrás gestionar Documentos</h1>
            <h2>{rutaActual}</h2>
            <div className='botones-container'>
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>

                <button onClick={handleFileSelection} className="btn-subir-archivo">
                    Subir Archivo
                </button>
                <button onClick={() => setMostrarCrearCarpeta(true)} className='btn-crear-carpeta'>
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
</div>

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

            <table className="tabla-documentos">
                <div className="tabla-documentos-container">
                    <thead>
                        <tr>
                            <th>Acción</th>
                            <th class="scrollable">Nombre</th>
                            <th class="scrollable">Subido Por</th>
                            <th>Categoría</th>
                            <th class="scrollable">Cliente</th>
                            <th>Privacidad</th>
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
                                    <td>{doc.categoria}</td>
                                    <td className="scrollable">{doc.cliente}</td>
                                    <td>{doc.privacidad}</td>
                                    <td>{new Date(doc.fecha_creacion).toLocaleString()}</td>
                                    <td>{new Date(doc.ultima_modificacion).toLocaleString()}</td>
                                    <td>
                                        <a href="#!" onClick={() => handleComentariosClick(doc.id)}>
                                            {doc.comentario ? 'Ver' : 'Añadir'}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No hay documentos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                    <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Gestión Documental - Todos los derechos reservados.</p>
        </footer>
                </div>
            </table>

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
                    documentoId={comentariosModal.documentoId}
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
