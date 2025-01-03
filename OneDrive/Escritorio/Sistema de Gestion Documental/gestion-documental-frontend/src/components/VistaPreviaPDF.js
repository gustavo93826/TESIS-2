import React, { useState, useRef } from "react";
import Modal from "react-modal";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const VistaPreviaPDF = ({ isOpen, onClose, file }) => {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  // Al cargar correctamente el documento, establecer el número de páginas
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Manejar el cambio de página según el desplazamiento
  function handleScroll() {
    const container = containerRef.current;
    if (container) {
      const pages = container.querySelectorAll(".react-pdf__Page");
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const pageTop = page.offsetTop;
        const pageBottom = pageTop + page.offsetHeight;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.offsetHeight;

        // Determinar si la página está en vista
        if (
          pageTop <= containerScrollTop + containerHeight / 2 &&
          pageBottom > containerScrollTop + containerHeight / 2
        ) {
          setCurrentPage(i + 1);
          break;
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Vista previa del PDF"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          overflow: "hidden",
        },
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: "right",
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Cerrar
      </button>
      <h2>Vista previa del PDF</h2>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "90%", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        {file ? (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {/* Renderizar todas las páginas del documento */}
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={1.5}
              />
            ))}
          </Document>
        ) : (
          <p>No se ha proporcionado un archivo PDF.</p>
        )}
      </div>
      {/* Indicador de página */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {currentPage} / {numPages}
      </div>
    </Modal>
  );
};

export default VistaPreviaPDF;
