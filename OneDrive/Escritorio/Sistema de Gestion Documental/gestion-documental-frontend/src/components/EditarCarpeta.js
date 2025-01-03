import React, { useState, useEffect } from 'react';
import './EditarCarpeta.css';

const EditarCarpeta = ({ userName, clientes, carpeta, onClose, onEditSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');

    useEffect(() => {
        if (carpeta) {
            setNombre(carpeta.nombre);
            setClienteSeleccionado(carpeta.cliente?.id || '');
        }
    }, [carpeta]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoNombre = nombre.trim();
        if (!nuevoNombre) {
            alert('El nombre de la carpeta no puede estar vacío.');
            return;
        }

        if (!clienteSeleccionado || clienteSeleccionado === '') {
            alert('Por favor selecciona un cliente.');
            return;
        }

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
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-submit">
                            Guardar Cambios
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

export default EditarCarpeta;
