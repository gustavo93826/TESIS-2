import React, { useEffect, useState } from "react";
import styles from "./PermisosArchivos.module.css";

const PermisosArchivos = ({ usuario, onClose }) => {
    const [clientes, setClientes] = useState([]);
    const [estadoClientes, setEstadoClientes] = useState({});

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const respuestaClientes = await fetch("http://localhost:8000/api/Clientes/lista/");
                const datosClientes = await respuestaClientes.json();
                const clientesConTodos = [{ id: "todos", nombre: "Todos" }, ...datosClientes];
                setClientes(clientesConTodos);

                const respuestaPermisos = await fetch(`http://localhost:8000/api/Permisos/cliente/?user_id=${usuario.id}`);
                const permisosCliente = await respuestaPermisos.json();

                // Inicializar estado basado en permisos actuales
                const estadoInicial = clientesConTodos.reduce((acc, cliente) => {
                    if (cliente.id === "todos") {
                        acc[cliente.id] = permisosCliente.cliente_archivos.length === 0;
                    } else {
                        acc[cliente.id] = permisosCliente.cliente_archivos.includes(cliente.id);
                    }
                    return acc;
                }, {});
                setEstadoClientes(estadoInicial);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        obtenerClientes();
    }, [usuario]);

    const manejarCambio = async (id) => {
        const nuevoEstado = { ...estadoClientes };

        if (id === "todos") {
            Object.keys(nuevoEstado).forEach((clave) => {
                nuevoEstado[clave] = clave === "todos";
            });
        } else {
            nuevoEstado[id] = !nuevoEstado[id];
            nuevoEstado["todos"] = false;

            // Si todos los toggles se desactivan, activar "Todos"
            const todosDesactivados = Object.keys(nuevoEstado)
                .filter((clave) => clave !== "todos")
                .every((clave) => !nuevoEstado[clave]);

            if (todosDesactivados) {
                nuevoEstado["todos"] = true;
            }
        }

        setEstadoClientes(nuevoEstado);

        // Enviar cambios al backend
        try {
            const clienteIds = nuevoEstado["todos"]
                ? "todos"
                : Object.keys(nuevoEstado)
                      .filter((clave) => nuevoEstado[clave] && clave !== "todos");

            await fetch("http://localhost:8000/api/Permisos/actualizar-clientes/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: usuario.id, cliente_ids: clienteIds }),
            });
        } catch (error) {
            console.error("Error al actualizar permisos:", error);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Acceso a documentos para {usuario?.nombre}</h3>
                <table className="tabla-clientes">
                    <thead>
                        <tr>
                            <th>Clientes</th>
                            <th>Autorización</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombre}</td>
                                <td>
                                    <label className={styles.toggleswitch}>
                                        <input
                                            type="checkbox"
                                            checked={estadoClientes[cliente.id] || false}
                                            onChange={() => manejarCambio(cliente.id)}
                                        />
                                        <span className="slider" />
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className={styles.btnCerrar} onClick={onClose}>
                    Salir
                </button>
            </div>
        </div>
    );
};

export default PermisosArchivos;
