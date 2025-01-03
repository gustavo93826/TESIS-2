import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import AdminForm from './components/AdminForm';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import GestionClientesPage from './pages/GestionClientesPage';
import AsignarPermisosPage from './pages/AsignarPermisosPage';
import CambiarContrasena from "./components/CambiarContrasena";

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
                            <Route path="gestion-usuarios" element={<GestionUsuariosPage />} />
                            <Route path="gestion-clientes" element={<GestionClientesPage />} />
                            <Route path="asignar-permisos" element={<AsignarPermisosPage />} />
                            </Routes>
                    </AdminForm>
                } />
            </Routes>
        </Router>
    );
};

export default App;
