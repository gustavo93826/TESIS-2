import React, { useState } from 'react';
import './ComentariosModal.css';

const ComentariosModal = ({ isOpen, documentoId, comentario, titulo, onClose, onUpdate }) => {
    const [nuevoComentario, setNuevoComentario] = useState(comentario || '');

    const handleGuardar = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/Documentos/${documentoId}/comentario/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comentario: nuevoComentario }),
            });

            if (response.ok) {
                alert('Comentario guardado exitosamente');
                onClose();
                if (onUpdate) onUpdate(); // Actualiza la lista de documentos después de guardar el comentario
            } else {
                alert('Error al guardar el comentario');
            }
        } catch (error) {
            console.error('Error al guardar el comentario:', error);
            alert('Ocurrió un error al guardar el comentario');
        }
    };

    return (
        <div className={`comentarios-modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2>{titulo || 'Comentarios'}</h2>
                <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe un comentario..."
                />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cerrar">
                        Cerrar
                    </button>
                    <button onClick={handleGuardar} className="btn-guardar">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComentariosModal;
