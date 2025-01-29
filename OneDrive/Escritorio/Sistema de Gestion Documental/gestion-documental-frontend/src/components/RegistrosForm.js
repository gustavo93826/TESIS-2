import React, { useEffect, useState } from "react";

const RegistrosForm = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [carpetas, setCarpetas] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [filtros, setFiltros] = useState({
        usuario: "",
        cliente: "",
        carpeta: "",
        documento: "",
        fecha: "",
    });

    // Fetch inicial de registros
    const fetchRegistros = () => {
        fetch("http://localhost:8000/api/registros/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los registros");
                }
                return response.json();
            })
            .then((data) => {
                setRegistros(data.registros);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error al cargar los registros");
                setLoading(false);
            });
    };

    // Fetch listas para los selectores del modal
    useEffect(() => {
        fetch("http://localhost:8000/api/usuarios/lista/")
            .then((res) => res.json())
            .then(setUsuarios);
        fetch("http://localhost:8000/api/Clientes/lista/")
            .then((res) => res.json())
            .then(setClientes);
        fetch("http://localhost:8000/api/Carpetas/lista_opciones/")
            .then((res) => res.json())
            .then(setCarpetas);
        fetch("http://localhost:8000/api/Documentos/lista_opciones/")
            .then((res) => res.json())
            .then(setDocumentos);
    }, []);

    useEffect(() => {
        fetchRegistros();
    }, []);

    const borrarRegistros = () => {
        if (window.confirm("¿Está seguro de que desea borrar todos los registros?")) {
            fetch("http://localhost:8000/api/registros/borrar/", {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al borrar los registros");
                    }
                    return response.json();
                })
                .then(() => {
                    setRegistros([]);
                    alert("Todos los registros han sido eliminados.");
                })
                .catch((err) => {
                    setError("Error al borrar los registros");
                });
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const handleLimpiarFiltros = () => {
        setFiltros({
            usuario: "",
            cliente: "",
            carpeta: "",
            documento: "",
            fecha: "",
        });
    };

    const handleConfirmarFiltros = () => {
        setLoading(true);
        fetch("http://localhost:8000/api/registros/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filtros),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los registros filtrados");
                }
                return response.json();
            })
            .then((data) => {
                setRegistros(data.registros);
                setLoading(false);
                handleCloseModal();
            })
            .catch((err) => {
                setError("Error al cargar los registros filtrados");
                setLoading(false);
            });
        handleCloseModal();
    };

    if (loading) return <div>Cargando registros...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
            <h2 style={{ textAlign: "center", fontSize: "35px", textTransform: "uppercase", textDecoration: "underline" }}>Historial de Actividades</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <button
                    onClick={borrarRegistros}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#ff6666",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    Borrar Registros
                </button>
                <button
                    onClick={handleOpenModal}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    Filtrar Registros
                </button>
            </div>
            <div style={{ padding: "10px", backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "800px", margin: "0 auto" }}>
                {registros.length > 0 ? (
                    registros.map((registro, index) => (
                        <div key={index} style={{ marginBottom: "20px", padding: "10px", borderBottom: "1px dashed #ccc" }}>
                            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{registro}</pre>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center" }}>No hay registros disponibles.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-container">
                    <div className="modal-content">
                        <h2>Filtrar Registros</h2>
                        <div className="form-group">
                            <label>Usuario</label>
                            <select name="usuario" value={filtros.usuario} onChange={handleFiltroChange}>
                                <option value="">Selecciona un usuario</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Cliente</label>
                            <select name="cliente" value={filtros.cliente} onChange={handleFiltroChange}>
                                <option value="">Selecciona un cliente</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Carpeta</label>
                            <select name="carpeta" value={filtros.carpeta} onChange={handleFiltroChange}>
                                <option value="">Selecciona una carpeta</option>
                                {carpetas.map((carpeta) => (
                                    <option key={carpeta.id} value={carpeta.id}>
                                        {carpeta.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Documento</label>
                            <select name="documento" value={filtros.documento} onChange={handleFiltroChange}>
                                <option value="">Selecciona un documento</option>
                                {documentos.map((documento) => (
                                    <option key={documento.id} value={documento.id}>
                                        {documento.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltroChange} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={handleCloseModal}>
                                Cancelar
                            </button>
                            <button className="btn-clear" onClick={handleLimpiarFiltros}>
                                Limpiar
                            </button>
                            <button className="btn-submit" onClick={handleConfirmarFiltros}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrosForm;
