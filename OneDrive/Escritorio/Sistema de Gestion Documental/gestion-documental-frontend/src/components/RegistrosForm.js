import React, { useEffect, useState } from "react";

const RegistrosForm = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchRegistros();
    }, []);

    if (loading) return <div>Cargando registros...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
            <h2 style={{ textAlign: "center", fontSize:"35px", textTransform:"uppercase", textDecoration:"underline" }}>Historial de Actividades</h2>
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
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#e55b5b";
                    e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ff6666";
                    e.target.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)";
                }}
            
            >
                Borrar Registros
            </button>
            <div
                style={{
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    maxWidth: "800px",
                    margin: "0 auto",
                }}
            >
                {registros.length > 0 ? (
                    registros.map((registro, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: "20px",
                                padding: "10px",
                                borderBottom: "1px dashed #ccc",
                            }}
                        >
                            <pre
                                style={{
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                }}
                            >
                                {registro}
                            </pre>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center" }}>
                        No hay registros disponibles.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrosForm;
