import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 
import RecuperarContrasena from './RecuperarContrasena';
import logo from './assets/PDGR.jpeg'; 


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isTempPassword, setIsTempPassword] = useState(false);
    const [showRecover, setShowRecover] = useState(false);
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChangeInput = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        if (value.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres.');
        } else {
            setPasswordError('');
        }
    };
    
    const handleConfirmPasswordInput = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value !== newPassword) {
            setPasswordError('Las contraseñas no coinciden.');
        } else if (newPassword.length >= 8) {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.status === 'reset_required') {
                    setIsTempPassword(true); // Cambia a modo de cambio de contraseña
                } else {
                    sessionStorage.setItem('userId', data.id);
                    sessionStorage.setItem('userName', data.nombre);
                    sessionStorage.setItem('userPermisos', JSON.stringify(data.permisos));
                    navigate(data.redirigir); // Redirige según el rol
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al autenticar:', error);
            alert('Error en la autenticación. Por favor, revisa tus credenciales.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/Establecer_password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    temp_password: password,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                sessionStorage.setItem('userId', data.id);
                sessionStorage.setItem('userName', data.nombre);
                sessionStorage.setItem('userPermisos', JSON.stringify(data.permisos));
                navigate(data.redirect); // Redirigir a la página del usuario
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            alert('Ocurrió un error al cambiar la contraseña.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={logo} alt="PDGR Abogados" className="logo" />
                <h1>Bienvenido!!!</h1>
                <p>
                    Para ingresar al sistema es necesario que el administrador haya creado su
                    cuenta y haber recibido su contraseña temporal al correo.
                </p>
            </div>

            <div className="login-right">
                {isTempPassword ? (
                    <form onSubmit={handlePasswordChange} className="login-form">
                        <h2>Cambiar Contraseña</h2>
                        <div className="form-group">
                            <label>Nueva Contraseña</label>
                            <input
                                type="password"
                                placeholder="Introduce tu nueva contraseña"
                                value={newPassword}
                                onChange={handlePasswordChangeInput}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordInput}
                                required
                            />
                        </div>
                        {passwordError && <p className="error-text">{passwordError}</p>} {/* Mensaje de error */}
                        <button type="submit" className="btn-acceder" disabled={!!passwordError}>
                            Guardar Contraseña
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Iniciar Sesión</h2>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="tu@Email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Introduce tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="forgot-password">
                            <a href="#!" onClick={() => setShowRecover(true)}>
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                        <button type="submit" className="btn-acceder">
                            Acceder
                        </button>
                    </form>
                )}
            </div>
            {showRecover && (
                <RecuperarContrasena onClose={() => setShowRecover(false)} />
            )}
        </div>
    );
};

export default LoginForm;
