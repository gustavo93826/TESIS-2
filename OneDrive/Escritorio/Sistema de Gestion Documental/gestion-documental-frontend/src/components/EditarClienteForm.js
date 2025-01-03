import React, { useState } from "react";
import styles from './EditarClienteForm.module.css';

const EditarClienteForm = ({ cliente, onClose, onClienteActualizado }) => {
    const [nombre, setNombre] = useState(cliente?.nombre || "");
    const [correo, setCorreo] = useState(cliente?.correo || "");
    const [direccion, setDireccion] = useState(cliente?.direccion || "");
    const [telefono, setTelefono] = useState(cliente?.telefono || "");
    const [error, setError] = useState("");

    // Validar los campos del formulario
    const validarFormulario = () => {
        if (!nombre.trim()) { // Solo el campo 'nombre' es obligatorio
            setError("El campo 'Nombre' es obligatorio.");
            return false;
        }
        setError("");
        return true;
    };

    // Guardar los cambios
    const guardarCambios = async () => {
        if (!validarFormulario()) return;

        try {
            const respuesta = await fetch(`http://localhost:8000/api/Clientes/${cliente.id}/editar/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    correo: correo || null, // Enviar null si el campo está vacío
                    direccion: direccion || null,
                    telefono: telefono || null,
                }),
            });

            if (respuesta.ok) {
                const datosActualizados = await respuesta.json();
                onClienteActualizado(datosActualizados); // Notificar cambios al componente principal
                onClose(); // Cerrar el formulario
            } else {
                const errorData = await respuesta.json();
                setError(errorData?.error || "Error al guardar los datos.");
            }
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            setError("Ocurrió un error al intentar guardar los cambios.");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Editar Cliente</h3>
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
                    Dirección:
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                </label>
                <label>
                    Teléfono:
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
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

export default EditarClienteForm;
