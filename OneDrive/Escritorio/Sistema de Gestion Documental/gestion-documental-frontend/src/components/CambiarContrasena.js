import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CambiarContrasena.module.css";
import logo from "./assets/PDGR.jpeg";
import successIcon from "./assets/Check.jpg";
import errorIcon from "./assets/Negate.jpg"; // Nueva imagen para enlace vencido

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isExpired, setIsExpired] = useState(false); // Estado para enlace vencido

    const query = new URLSearchParams(useLocation().search);
    const email = query.get("email");
    const token = query.get("token");
    const navigate = useNavigate();

    // Verificar si el enlace ha expirado
    useEffect(() => {
        const validarToken = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/Validar_token/?token=${token}`
                );
                const data = await response.json();

                if (response.status !== 200) {
                    setIsExpired(true); // Token expirado o inválido
                }
            } catch (err) {
                console.error("Error al validar el token:", err);
                setIsExpired(true);
            }
        };

        if (token) validarToken();
    }, [token]);

    // Mostrar interfaz de enlace vencido
    if (isExpired) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorMessage}>
                    <img
                        src={errorIcon}
                        alt="Error"
                        className={styles.errorIcon}
                    />
                    <h2>El enlace ha expirado</h2>
                    <p>Por favor, solicite un nuevo enlace de recuperación.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Por favor, rellene todos los campos.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/Cambiar_password/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        new_password: newPassword,
                        confirm_password: confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setError("");
            } else {
                setError(
                    data.error || "Ocurrió un error al cambiar la contraseña."
                );
            }
        } catch (err) {
            setError("Error al conectar con el servidor. Intente de nuevo.");
            console.error(err);
        }
    };

    // Renderizar pantalla de éxito
    if (success) {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successMessage}>
                    <img
                        src={successIcon}
                        alt="Éxito"
                        className={styles.successIcon}
                    />
                    <h2>Se ha logrado cambiar la contraseña con éxito!!!!!</h2>
                    <p>Puede cerrar esta página</p>
                </div>
            </div>
        );
    }

    // Pantalla de formulario
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Recuperar Contraseña</h2>
                    <p>Introduce una nueva contraseña para {email}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>
                        <strong>Contraseña</strong>
                        <input
                            type="password"
                            placeholder="Introduzca su nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </label>

                    <label>
                        <strong>Confirme la contraseña</strong>
                        <input
                            type="password"
                            placeholder="Confirme la contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </label>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.button}>
                        Confirmar
                    </button>
                </form>
            </div>

            {/* Aviso */}
            <div className={styles.notice}>
                <div>
                    <img
                        src={logo}
                        alt="PDGR Abogados"
                        className={styles.logo}
                    />
                    <h3>AVISO:</h3>
                    <p>
                        La contraseña debe tener mínimo 8 caracteres y usar al
                        menos uno de estos caracteres especiales: ! # $ % & * +
                        - / : ; &lt; = &gt; ? @ _
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
