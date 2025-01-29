import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import { init } from "pptx-preview";
import { renderAsync } from "docx-preview";
import VistaPreviaPDF from "./VistaPreviaPDF";

const VistaPreviaArchivo = ({ isOpen, onClose, file, fileType }) => {
  const [content, setContent] = useState(null);
  const docxContainerRef = useRef(null);
  const pptxContainerRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    const loadFile = async () => {
      try {
        if (!file || !fileType) {
          setContent(<p>No se ha proporcionado un archivo válido.</p>);
          return;
        }

        if (fileType === "docx") {
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          if (docxContainerRef.current) {
            docxContainerRef.current.innerHTML = "";
            await renderAsync(arrayBuffer, docxContainerRef.current);
          }
        } else if (fileType === "pptx") {
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          console.log(arrayBuffer); 
          if (pptxContainerRef.current) {
            pptxContainerRef.current.style.width = "100%";
            pptxContainerRef.current.style.height = "800px";
            pptxContainerRef.current.style.overflow = "auto";
            
            
            try {
              init({ container: pptxContainerRef.current, file: arrayBuffer });
            } catch (err) {
              console.error("Error inicializando pptx-preview:", err);
            }
          }
        } else if (fileType === "xlsx") {
          const response = await fetch(file);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet);
          setContent(
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        } else if (["png", "jpg", "jpeg"].includes(fileType)) {
          setContent(<img src={file} alt="Vista previa" style={{ maxWidth: "100%" }} />);
        } else if (fileType === "txt") {
          const response = await fetch(file);
          const text = await response.text();
          setContent(<pre>{text}</pre>);
        } else {
          setContent(<p>Este tipo de archivo no es compatible.</p>);
        }
      } catch (error) {
        console.error("Error al cargar el archivo:", error);
        setContent(<p>Error al cargar el archivo.</p>);
      }
    };

    loadFile();
  }, [file, fileType]);

  return (
    <>
      {fileType === "pdf" ? (
        <VistaPreviaPDF isOpen={isOpen} onClose={onClose} file={file} />
      ) : (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Vista previa del archivo"
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
              overflow: "auto",
            },
          }}
        >
          <button onClick={onClose} style={{ float: "right" }}>
            Cerrar
          </button>
          <h2>Vista previa del archivo</h2>
          <div>
            {fileType === "docx" ? (
              <div ref={docxContainerRef} style={{ overflow: "auto" }}></div>
            ) : fileType === "pptx" ? (
              <div
                ref={pptxContainerRef}
                style={{
                  width: "100%",
                  height: "800px",
                  overflow: "auto",
                  border: "1px solid red",
                  
                }}
              ></div>
            ) : (
              content
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default VistaPreviaArchivo;
