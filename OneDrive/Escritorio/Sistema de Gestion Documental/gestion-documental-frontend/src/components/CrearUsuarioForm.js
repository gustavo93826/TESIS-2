import React, { useState } from "react";
import styles from './CrearUsuarioForm.module.css';

const CrearUsuarioForm = ({ onClose, onUsuarioCreado }) => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [rol, setRol] = useState("");
    const [error, setError] = useState("");

    // Validar los campos del formulario
    const validarFormulario = () => {
        if (!nombre || !correo || !rol) {
            setError("Todos los campos son obligatorios.");
            return false;
        }
        setError("");
        return true;
    };

    // Enviar datos al backend
    const confirmarUsuario = async () => {
        if (!validarFormulario()) return;

        try {
            const respuesta = await fetch("http://localhost:8000/api/usuarios/crear/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, email: correo, rol }),
            });

            if (respuesta.ok) {
                const nuevoUsuario = await respuesta.json();
                onUsuarioCreado(nuevoUsuario); // Notificar al componente principal
                onClose(); // Cerrar el formulario
            } else {
                setError("Error al crear el usuario.");
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
            setError("Ocurrió un error al crear el usuario.");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Crear Usuario</h3>
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
                        <option value="1">Administrador</option>
                        <option value="2">Abogado</option>
                        <option value="3">Auxiliar Administrativo</option>
                        <option value="4">Asistente</option>
                    </select>
                </label>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.modalButtons}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={confirmarUsuario}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default CrearUsuarioForm;
