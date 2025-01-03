import React, { useState } from "react";
import styles from './EditarUsuarioForm.module.css';

const EditarUsuarioForm = ({ usuario, onClose, onUsuarioActualizado }) => {
    const [nombre, setNombre] = useState(usuario?.nombre || "");
    const [correo, setCorreo] = useState(usuario?.email || "");
    const [rol, setRol] = useState(usuario?.rol?.toString() || "");
    const [error, setError] = useState("");

    const roles = [
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Abogado" },
        { id: 3, nombre: "Auxiliar Administrativo" },
        { id: 4, nombre: "Asistente" },
    ];

    const validarFormulario = () => {
        if (!nombre.trim() || !correo.trim() || !rol) {
            setError("Todos los campos son obligatorios.");
            return false;
        }
        setError("");
        return true;
    };

    const guardarCambios = async () => {
        if (!validarFormulario()) return;

        try {
            const respuesta = await fetch(`http://localhost:8000/api/usuarios/${usuario.id}/editar/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    email: correo,
                    rol: parseInt(rol),
                }),
            });

            if (respuesta.ok) {
                const datosActualizados = await respuesta.json();
                onUsuarioActualizado(datosActualizados);
                onClose();
            } else {
                const errorData = await respuesta.json();
                setError(errorData?.message || "Error al guardar los datos.");
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            setError("Ocurrió un error al intentar guardar los cambios.");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Editar Usuario</h3>
                <label>
                    Nombre:
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </label>
                <label>
                    Correo:
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </label>
                <label>
                    Rol:
                    <select value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="">Selecciona un rol</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.nombre}
                            </option>
                        ))}
                    </select>
                </label>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.modalButtons}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={guardarCambios}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default EditarUsuarioForm;
