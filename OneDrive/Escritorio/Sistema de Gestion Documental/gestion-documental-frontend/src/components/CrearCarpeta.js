import React, { useState } from 'react';
import './CrearCarpeta.css'; 

const CrearCarpeta = ({ rutaActual, userName, clientes, ubicacion, onClose, onUploadSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const CARACTERES_NO_PERMITIDOS = /[\/\\<>:"|?*.']/;

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

  const handleNombreChange = (e) => {
    const nuevoNombre = e.target.value;
    if (CARACTERES_NO_PERMITIDOS.test(nuevoNombre)) {
      setError('El nombre de la carpeta contiene caracteres no permitidos.');
    } else {
      setError('');
      setNombre(nuevoNombre);
    }
  };

  const handleCrearCarpeta = async () => {
    if (!nombre) {
      setError('El nombre de la carpeta es obligatorio.');
      return;
    }
    if (!clienteSeleccionado) {
      setError('Debe seleccionar un cliente.');
      return;
    }
    if (CARACTERES_NO_PERMITIDOS.test(nombre)) {
      setError('El nombre de la carpeta contiene caracteres no permitidos.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const clientesAsociados = await clientesAcceso(userId);

    if (clientesAsociados.length > 0 && !clientesAsociados.includes(parseInt(clienteSeleccionado))) {
      setMensajeError('No puedes elegir este cliente.');
      return;
    }

    setError(''); // Limpiar errores previos
    setMensajeError(''); // Limpiar mensaje de error de cliente

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
        alert('Carpeta creada con éxito.');
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
        {error && <p className='error-message'>{error}</p>}
        {mensajeError && <p className='error-message'>{mensajeError}</p>}
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la carpeta</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={handleNombreChange}
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
