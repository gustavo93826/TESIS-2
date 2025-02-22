import React, { useState, useEffect } from 'react';
import './SubirArchivo.css';

const BusquedaAvanzada = ({ clientes, usuarios, onClose, onBuscar }) => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [categoria, setCategoria] = useState('');
    const [creadoPorSeleccionado, setCreadoPorSeleccionado] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');

    // Cargar filtros guardados en localStorage
    useEffect(() => {
        const filtrosGuardados = JSON.parse(localStorage.getItem('filtrosBusqueda')) || {};
        setClienteSeleccionado(filtrosGuardados.cliente || '');
        setCategoria(filtrosGuardados.categoria || '');
        setCreadoPorSeleccionado(filtrosGuardados.creadoPor || '');
        setFechaCreacion(filtrosGuardados.fechaCreacion || '');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const filtros = {
            cliente: clienteSeleccionado,
            categoria,
            creadoPor: creadoPorSeleccionado,
            fechaCreacion,
        };

        // Guardar filtros en localStorage
        localStorage.setItem('filtrosBusqueda', JSON.stringify(filtros));
        
        onBuscar(filtros); // Enviar filtros al backend o a otro componente
        onClose(); // Cerrar el modal
    };

    const handleLimpiar = () => {
        setClienteSeleccionado('');
        setCategoria('');
        setCreadoPorSeleccionado('');
        setFechaCreacion('');
        localStorage.removeItem('filtrosBusqueda'); // Eliminar filtros de localStorage
        onBuscar({});
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>Búsqueda Avanzada</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Cliente</label>
                        <select
                            value={clienteSeleccionado}
                            onChange={(e) => setClienteSeleccionado(e.target.value)}
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
                            <option value="">Selecciona una categoría</option>
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
                    <div className="form-group">
                        <label>Creado por</label>
                        <select
                            value={creadoPorSeleccionado}
                            onChange={(e) => setCreadoPorSeleccionado(e.target.value)}
                        >
                            <option value="">Selecciona un usuario</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Fecha de creación</label>
                        <input
                            type="date"
                            value={fechaCreacion}
                            onChange={(e) => setFechaCreacion(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn-clear" onClick={handleLimpiar}>
                            Limpiar
                        </button>
                        <button type="submit" className="btn-submit">
                            Buscar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusquedaAvanzada;
