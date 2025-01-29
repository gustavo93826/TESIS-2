import React, { useEffect, useState } from "react";
import CrearUsuarioForm from "./CrearUsuarioForm";
import EditarUsuarioForm from "./EditarUsuarioForm"; 
import "./UsuarioForm.css";

const UsuarioForm = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    // Definimos el mapeo de roles
    const roles = {
        1: "Administrador",
        2: "Abogado",
        3: "Auxiliar Administrativo",
        4: "Asistente",
    };

    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                const respuesta = await fetch("http://localhost:8000/api/usuarios/");
                const datos = await respuesta.json();
                const usuariosOrdenados = datos.sort((a, b) => a.rol - b.rol);
                setUsuarios(usuariosOrdenados);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerUsuarios();
    }, []);

    const eliminarUsuario = async (usuarioId) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await fetch(`http://localhost:8000/api/usuarios/${usuarioId}/eliminar/`, {
                    method: "DELETE",
                });
                setUsuarios(usuarios.filter((usuario) => usuario.id !== usuarioId));
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
            }
        }
    };

    const agregarUsuario = (nuevoUsuario) => {
        setUsuarios([...usuarios, nuevoUsuario]);
    };

    const actualizarUsuario = async (usuarioActualizado) => {
        try {
            const respuesta = await fetch(
                `http://localhost:8000/api/usuarios/${usuarioActualizado.id}/actualizar/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(usuarioActualizado),
                }
            );

            if (!respuesta.ok) {
                throw new Error("Error al actualizar el usuario");
            }

            const datos = await respuesta.json();

            setUsuarios(
                usuarios.map((usuario) =>
                    usuario.id === datos.id ? datos : usuario
                )
            );
            
            setUsuarioSeleccionado(null);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        }
    };

    return (
        <div className="Usuario">
            <h1>Gestión de Usuarios</h1>
            <button onClick={() => setMostrarFormularioCrear(true)}>Crear Usuario</button>
            {cargando ? (
                <p>Cargando usuarios...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Fecha de Creación</th> 
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>{roles[usuario.rol] || "Desconocido"}</td>
                                <td>{usuario.fecha_creacion}</td> {/* Mostrar fecha */}
                                <td>
                                    <button
                                        onClick={() => setUsuarioSeleccionado(usuario)}
                                        className="boton-accion boton-editar"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => eliminarUsuario(usuario.id)}
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
                <CrearUsuarioForm
                    onClose={() => setMostrarFormularioCrear(false)}
                    onUsuarioCreado={agregarUsuario}
                />
            )}
            {usuarioSeleccionado && (
                <EditarUsuarioForm
                    usuario={usuarioSeleccionado}
                    onClose={() => setUsuarioSeleccionado(null)}
                    onUsuarioActualizado={actualizarUsuario}
                />
            )}
        </div>
    );
};

export default UsuarioForm;
