import React, { useState, useEffect } from 'react';
import './MoverArchivo.css';

const MoverArchivoModal = ({  documento, onClose, onMoveSuccess }) => {
    const [carpetas, setCarpetas] = useState([]);
    const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);

    useEffect(() => {
        const fetchCarpetas = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/Carpetas/opciones/');
                const data = await response.json();
                setCarpetas(data);
            } catch (error) {
                console.error('Error al obtener carpetas:', error);
            }
        };

        
        
    });

    const handleMoverArchivo = async () => {
        if (!carpetaSeleccionada) {
            alert('Seleccione una carpeta de destino.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/Documentos/${documento.id}/mover/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nueva_carpeta: carpetaSeleccionada }),
            });

            if (!response.ok) {
                throw new Error('No se pudo mover el archivo.');
            }

            alert('Archivo movido con éxito.');
            onMoveSuccess();
            onClose();
        } catch (error) {
            console.error('Error al mover archivo:', error);
            alert('Ocurrió un error al mover el archivo.');
        }
    };

    

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Mover Archivo</h2>
                <p>Selecciona la carpeta de destino:</p>
                <select onChange={(e) => setCarpetaSeleccionada(e.target.value)} value={carpetaSeleccionada}>
                    <option value="">Seleccione una carpeta</option>
                    {carpetas.map((carpeta) => (
                        <option key={carpeta.id} value={carpeta.id}>
                            {carpeta.nombre}
                        </option>
                    ))}
                </select>
                <div className="modal-actions">
                    <button onClick={handleMoverArchivo}>Mover</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default MoverArchivoModal;
