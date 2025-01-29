import React, { useState } from 'react';
import './ComentariosModal.css';

const ComentariosModal = ({ isOpen, id, tipo, comentario, titulo, onClose, onUpdate }) => {
    const [nuevoComentario, setNuevoComentario] = useState('');

    const handleInputChange = (e) => {
        setNuevoComentario(e.target.value);
    };

    const handleAddComment = async () => {
        if (!nuevoComentario.trim()) {
            alert('El comentario no puede estar vacío.');
            return;
        }

        const userName = sessionStorage.getItem('userName'); // Obtener el usuario del sessionStorage

        if (!userName) {
            alert('No se encontró el nombre de usuario.');
            return;
        }

        try {
            const endpoint =
                tipo ==='carpeta'
                ? `http://localhost:8000/api/Carpetas/${id}/manejar-comentarios/`
                : `http://localhost:8000/api/Documentos/${id}/manejar-comentarios/`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comentario: nuevoComentario, usuario: userName, }),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el comentario.');
            }

            const data = await response.json();
            alert('Comentario agregado con éxito.');
            onUpdate(); // Refresca la lista de documentos
            onClose();  // Cierra el modal
        } catch (error) {
            console.error('Error al agregar el comentario:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{titulo}</h2>
                <textarea
                    className="nuevo-comentario-textarea"
                    value={nuevoComentario}
                    onChange={handleInputChange}
                    placeholder="Escribe un nuevo comentario aquí..."
                />
                <textarea
                    className="comentarios-textarea"
                    value={comentario}
                    readOnly
                    placeholder="No hay comentarios todavía."
                />
                <div className="modal-buttons">
                    <button className="btn" onClick={handleAddComment}>Añadir Comentario</button>
                    <button className="btn" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ComentariosModal;
