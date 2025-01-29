import React, { useEffect, useState } from "react";
import "./PermisosForm.css";
import PermisosArchivos from "./PermisosArchivos";

const PermisosUsuarioForm = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const roles = {
        1: "Administrador",
        2: "Abogado",
        3: "Auxiliar Administrativo",
        4: "Asistente",
    };

    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                const respuesta = await fetch("http://localhost:8000/api/Permisos/lista/");
                const datos = await respuesta.json();
                const permisosOrdenados = datos.sort((a, b) => a.rol - b.rol);
            setUsuarios(permisosOrdenados);
            } catch (error) {
                console.error("Error al cargar permisos de usuarios:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerUsuarios();
    }, []);

    const actualizarPermiso = async (userId, permiso, estado) => {
        try {
            const respuesta = await fetch("http://localhost:8000/api/Permisos/lista/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `user_id=${userId}&permiso=${permiso}&estado=${estado}`,
            });

            const resultado = await respuesta.json();

            if (!resultado.success) {
                alert(resultado.message);
            } else {
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((usuario) =>
                        usuario.id === userId
                            ? { ...usuario, [permiso]: estado }
                            : usuario
                    )
                );
            }
        } catch (error) {
            console.error("Error al actualizar el permiso:", error);
        }
    };

    const abrirModal = (usuario) => {
        console.log("Abrir modal con usuario:", usuario)
        setUsuarioSeleccionado(usuario); // Guardar el usuario seleccionado
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setUsuarioSeleccionado(null); // Limpiar el usuario seleccionado
        setModalAbierto(false);
    };

    return (
        <div className="permisos-form-container">
            <h1>Asignar Permisos</h1>
            {cargando ? (
                <p className="mensaje-carga">Cargando permisos...</p>
            ) : (
                <table className="tabla-permisos">
                    <thead>
                        <tr>
                            <th>Activar</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Archivos</th>
                            <th>Subir Archivos</th>
                            <th>Crear Carpetas</th>
                            <th>Editar</th>
                            <th>Ver</th>
                            <th>Eliminar</th>
                            <th>Descargar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={usuario.activar}
                        onChange={(e) =>
                            actualizarPermiso(
                                usuario.id,
                                "activar",
                                e.target.checked
                            )
                        }
                    />
                    <span className="slider" />
                </label>
            </td>
                                <td>{usuario.nombre}</td>
                                <td>{roles[usuario.rol] || "Desconocido"}</td>
                                <td>
                                    <button
                                        className="btn-acceso"
                                        onClick={() => abrirModal(usuario)} // Pasar el usuario al abrir el modal
                                    >
                                        Acceso
                                    </button>
                                </td>
                                {[
                                    "subir_archivo",
                                    "crear_carpeta",
                                    "editar",
                                    "ver",
                                    "eliminar",
                                    "descargar",
                                ].map((permiso) => (
                                    <td key={permiso}>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={usuario[permiso]}
                                                onChange={(e) =>
                                                    actualizarPermiso(
                                                        usuario.id,
                                                        permiso,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span className="slider" />
                                        </label>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {modalAbierto &&  (
                <PermisosArchivos
                    usuario={usuarioSeleccionado} // Pasar el usuario seleccionado al modal
                    onClose={cerrarModal}
                />
            )}
        </div>
    );
};

export default PermisosUsuarioForm;
