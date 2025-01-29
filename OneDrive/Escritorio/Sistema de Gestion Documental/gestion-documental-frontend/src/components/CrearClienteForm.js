import React, { useState } from "react";
import styles from './CrearClienteForm.module.css';

const CrearClienteForm = ({ onClose, onClienteCreado }) => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [error, setError] = useState("");

    // Validar los campos del formulario
    const validarFormulario = () => {
        if (!nombre) {  // Solo el nombre es obligatorio
            setError("El campo 'Nombre' es obligatorio.");
            return false;
        }
        setError("");
        return true;
    };

    // Enviar datos al backend
    const confirmarCliente = async () => {
        if (!validarFormulario()) return;

        try {
            const respuesta = await fetch("http://localhost:8000/api/Clientes/crear/", {
                method: "POST",
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
                const nuevoCliente = await respuesta.json();
                alert('Se ha añadido el nuevo cliente.');
                onClienteCreado(nuevoCliente); // Notificar al componente principal
                onClose(); // Cerrar el formulario
            } else {
                const errorData = await respuesta.json();
                setError(errorData.error || "Error al crear el cliente.");
            }
        } catch (error) {
            console.error("Error al crear cliente:", error);
            setError("Ocurrió un error al crear el cliente.");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Crear Cliente</h3>
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
                    <button onClick={confirmarCliente}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default CrearClienteForm;
