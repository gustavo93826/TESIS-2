import React, { useState } from 'react';
import './SubirArchivo.css';

const SubirArchivo = ({ userName, clientes, archivo, rutaActual,ubicacion,onClose, onUploadSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [comentario, setComentario] = useState('');
    const [categoria, setCategoria] = useState('otro');
    const [privacidad, setPrivacidad] = useState('publico');
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clienteSeleccionado) {
            alert('Por favor selecciona un cliente.');
            return;
            
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('comentario', comentario);
        formData.append('categoria', categoria);
        formData.append('archivo', archivo); // Utilizar archivo seleccionado
        formData.append('privacidad', privacidad);
        formData.append('creado_por', userName); // Usuario actual
        formData.append('cliente', clienteSeleccionado);
        formData.append('rutaActual', rutaActual);
        if (ubicacion) {
            formData.append('carpeta', ubicacion); // Si estás en una subcarpeta, envía el ID de la carpeta
        }

        try {
            const response = await fetch('http://localhost:8000/api/Documentos/subir_documento/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Documento subido con éxito.');
                onUploadSuccess(); 
                onClose(); // Cerrar modal
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al subir el documento:', error);
            alert('Ocurrió un error al subir el documento.');
        }
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>Subir Archivo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Archivo seleccionado</label>
                        <input type="text" value={archivo ? archivo.name : 'Ningún archivo seleccionado'}
                        readOnly />
                    </div>
                    <div className="form-group">
                        <label>Nombre del documento</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Cliente</label>
                        <select
                            value={clienteSeleccionado}
                            onChange={(e) => setClienteSeleccionado(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="otro">Otro</option>
                            <option value="acta">Acta</option>
                            <option value="acuerdo">Acuerdo</option>
                            <option value="carta">Carta</option>
                            <option value="cierres">Cierres</option>
                            <option value="comunicacion">Comunicación</option>
                            <option value="contrato">Contrato</option>
                            <option value="declaracion">Declaración</option>
                            <option value="disposicion">Disposición</option>
                            <option value="estatutos">Estatutos</option>
                            <option value="forma">Forma</option>
                            <option value="memorandum">Memorándum</option>
                            <option value="oficio">Oficio</option>
                            <option value="poder">Poder</option>
                            <option value="quejas">Quejas</option>
                            <option value="repuesta">Respuesta</option>
                            <option value="reporte">Reporte</option>
                            <option value="resolucion">Resolución</option>
                            <option value="solicitud">Solicitud</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Privacidad</label>
                        <select
                            value={privacidad}
                            onChange={(e) => setPrivacidad(e.target.value)}
                        >
                            <option value="publico">Público</option>
                            <option value="privado">Privado</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Comentario</label>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-submit">
                            Subir Documento
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubirArchivo;
