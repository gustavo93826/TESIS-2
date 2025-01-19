import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const userName = sessionStorage.getItem('userName');
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('userName'); // Usa sessionStorage si guardaste ahí
        navigate('/');
    };

    return (
        <div className="navbar">
            <h1 title={`Administrador: ${userName}`}>Administrador: {userName}</h1>
            <button onClick={handleLogout} >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Navbar;