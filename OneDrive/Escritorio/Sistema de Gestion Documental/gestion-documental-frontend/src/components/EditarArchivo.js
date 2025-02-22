import React, { useState, useEffect } from 'react';
import './EditarArchivo.css';

const EditarArchivo = ({ userName, clientes, documento, onClose, onEditSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('otro');
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        if (documento) {
            const nombreSinExtension = documento.nombre.split('.').slice(0, -1).join('.'); // Eliminar la extensión
            setNombre(nombreSinExtension);
            setCategoria(documento.categoria || 'otro');
            setClienteSeleccionado(documento.cliente?.id || '');
        }
    }, [documento]);

    const clientesAcceso = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/Permisos/cliente-archivos-ids/?user_id=${userId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (!response.ok) {
                throw new Error('Error al verificar permisos');
            }
            const Acceso = await response.json();
            return Acceso.cliente_archivos_ids;
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            alert('Hubo un problema al verificar tus permisos. Por favor, intenta nuevamente.');
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = sessionStorage.getItem('userId');
        const clientesAsociados = await clientesAcceso(userId);

        if (!clienteSeleccionado) {
            alert('Por favor selecciona un cliente.');
            return;
        }

        if (clientesAsociados.length > 0 && !clientesAsociados.includes(parseInt(clienteSeleccionado))) {
            setMensajeError('No puedes elegir este cliente.');
            return;
        }

        setMensajeError('');

        const nuevoNombre = nombre.trim(); 

        try {
            const response = await fetch(`http://localhost:8000/api/Documentos/${documento.id}/editar/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    categoria,
                    modificado_por: userName,
                    cliente: clienteSeleccionado,
                }),
            });

            if (response.ok) {
                alert('Documento actualizado con éxito.');
                onEditSuccess();
                onClose();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al actualizar el documento:', error);
            alert(`Error al actualizar el documento: ${error.message}`);
        }
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>Editar Archivo</h2>
                <form onSubmit={handleSubmit}>
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
                            <option value="" disabled>Selecciona un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                        {mensajeError && <p className="error-message">{mensajeError}</p>}
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
                            <option value="demanda">Demanda</option>
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
                            <option value="sentencia">Sentencia</option>
                            <option value="solicitud">Solicitud</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarArchivo;
