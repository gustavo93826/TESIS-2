import React, { useState, useEffect } from 'react';
import './EditarCarpeta.css';

const EditarCarpeta = ({ userName, clientes, carpeta, onClose, onEditSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        if (carpeta) {
            setNombre(carpeta.nombre);
            setClienteSeleccionado(carpeta.cliente?.id || '');
        }
    }, [carpeta]);
    
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

        const nuevoNombre = nombre.trim();
        if (!nuevoNombre) {
            alert('El nombre de la carpeta no puede estar vacío.');
            return;
        }

        if (!clienteSeleccionado || clienteSeleccionado === '') {
            alert('Por favor selecciona un cliente.');
            return;
        }

        if (clientesAsociados.length > 0 && !clientesAsociados.includes(parseInt(clienteSeleccionado))) {
            setMensajeError('No puedes elegir este cliente.');
            return;
        }

        setMensajeError('');

        try {
            const response = await fetch(`http://localhost:8000/api/Carpetas/${carpeta.id}/editar/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    cliente: clienteSeleccionado,
                    modificado_por: userName,
                }),
            });

            if (response.ok) {
                alert('Carpeta actualizada con éxito.');
                if (onEditSuccess) {
                    onEditSuccess(); // Llama a la función para actualizar la lista
                }
                onClose();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al actualizar la carpeta:', error);
            alert(`Error al actualizar la carpeta: ${error.message}`);
        }
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>Editar Carpeta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre de la carpeta</label>
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

export default EditarCarpeta;
