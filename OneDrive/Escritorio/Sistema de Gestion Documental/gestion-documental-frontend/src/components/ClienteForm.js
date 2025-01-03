import React, { useEffect, useState } from "react";
import CrearClienteForm from "./CrearClienteForm";
import EditarClienteForm from "./EditarClienteForm"; 
import "./ClienteForm.css";

const ClienteForm = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    // Obtener clientes al cargar el componente
    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const respuesta = await fetch("http://localhost:8000/api/Clientes/");
                const datos = await respuesta.json();
                setClientes(datos);
            } catch (error) {
                console.error("Error al cargar clientes:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerClientes();
    }, []);

    // Eliminar cliente
    const eliminarCliente = async (clienteId) => {
        if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
            try {
                await fetch(`http://localhost:8000/api/Clientes/${clienteId}/eliminar/`, {
                    method: "DELETE",
                });
                setClientes(clientes.filter((cliente) => cliente.id !== clienteId));
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
            }
        }
    };

    // Agregar cliente
    const agregarCliente = (nuevoCliente) => {
        setClientes([...clientes, nuevoCliente]);
    };

    // Actualizar cliente
    const actualizarCliente = (clienteActualizado) => {
        setClientes(
            clientes.map((cliente) =>
                cliente.id === clienteActualizado.id ? clienteActualizado : cliente
            )
        );
        setClienteSeleccionado(null);
    };

    return (
        <div className="cliente-form-container">
            <h1>Gestión de Clientes</h1>
            <button 
                onClick={() => setMostrarFormularioCrear(true)} 
                className="boton-accion boton-crear"
            >
                Añadir Cliente
            </button>
            {cargando ? (
                <p>Cargando clientes...</p>
            ) : (
                <table className="tabla-clientes">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Dirección</th>
                            <th>Teléfono</th> 
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.correo || "Vacio"}</td>
                                <td>{cliente.direccion || "Vacio"}</td>
                                <td>{cliente.telefono || "Vacio"}</td>
                                <td>
                                    <button
                                        onClick={() => setClienteSeleccionado(cliente)}
                                        className="boton-accion boton-editar"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => eliminarCliente(cliente.id)}
                                        className="boton-accion boton-eliminar"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {mostrarFormularioCrear && (
                <CrearClienteForm
                    onClose={() => setMostrarFormularioCrear(false)}
                    onClienteCreado={agregarCliente}
                />
            )}
            {clienteSeleccionado && (
                <EditarClienteForm
                    cliente={clienteSeleccionado}
                    onClose={() => setClienteSeleccionado(null)}
                    onClienteActualizado={actualizarCliente}
                />
            )}
        </div>
    );
};

export default ClienteForm;
