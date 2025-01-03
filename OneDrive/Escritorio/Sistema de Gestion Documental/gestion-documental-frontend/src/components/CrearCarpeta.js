import React, { useState } from 'react';
import './CrearCarpeta.css'; // Archivo CSS para el diseño del modal

const CrearCarpeta = ({ rutaActual, userName, clientes, ubicacion,onClose, onUploadSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  

  const handleCrearCarpeta = async () => {
    if (!nombre) {
      setError('El nombre de la carpeta es obligatorio.');
      return;
    }
    if (!clienteSeleccionado) {
      setError('Debe seleccionar un cliente.');
      return;
    }

    setError(''); // Limpiar errores previos

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('cliente', clienteSeleccionado);
    formData.append('creado_por', userName);
    formData.append('ruta', rutaActual);
    formData.append('carpeta_padre', ubicacion || 0); 


    try {
      const response = await fetch('http://localhost:8000/api/Documentos/crear-carpeta/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Carpeta con éxito.');
        onUploadSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la carpeta.');
      }
    } catch (error) {
      setError('Error de red o del servidor al crear la carpeta.');
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Crear Carpeta</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la carpeta</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese el nombre de la carpeta"
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
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-submit" onClick={handleCrearCarpeta}>
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearCarpeta;
