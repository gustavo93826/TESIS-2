import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import AdminForm from './components/AdminForm';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import GestionClientesPage from './pages/GestionClientesPage';
import AsignarPermisosPage from './pages/AsignarPermisosPage';
import CambiarContrasena from "./components/CambiarContrasena";
import RegistrosPage from './pages/RegistrosPage';
import InformacionPage from './pages/InformacionPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/Cambiar_password" element={<CambiarContrasena />} />
                <Route path="/admin/*" element={
                    <AdminForm>
                        <Routes>
                            <Route path="informacion" element={<InformacionPage />} />
                            <Route path="gestion-usuarios" element={<GestionUsuariosPage />} />
                            <Route path="gestion-clientes" element={<GestionClientesPage />} />
                            <Route path="asignar-permisos" element={<AsignarPermisosPage />} />
                            <Route path="registros" element={<RegistrosPage />} />
                            </Routes>
                    </AdminForm>
                } />
            </Routes>
        </Router>
    );
};

export default App;
