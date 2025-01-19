import React, { useState } from "react";
import styles from "./RecuperarContrasena.module.css";

const RecuperarContrasena = ({ onClose }) => {
    const [correo, setCorreo] = useState("");

    const handleSubmit = async () => {
        if (!correo) {
            alert("Por favor, ingrese su correo electrónico.");
            return;
        }
        
        try {
            const response = await fetch("http://localhost:8000/api/Recuperar_password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: correo }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);  
            } else {
                alert(data.error);  
            }
            onClose();  
        } catch (error) {
            console.error("Error al enviar el correo de recuperación:", error);
            alert("Hubo un error al intentar recuperar la contraseña.");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Recuperar Contraseña</h3>
                <div className={styles.modalIcon}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1034/1034149.png"
                        alt="Recuperar"
                    />
                </div>
                <label>
                    Introduzca su correo electrónico:
                    <input
                        type="email"
                        value={correo}
                        placeholder="Introduzca su correo"
                        onChange={(e) => setCorreo(e.target.value)}
                        className={styles.inputField}
                    />
                </label>
                <div className={styles.modalButtons}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className={styles.confirmButton}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecuperarContrasena;
