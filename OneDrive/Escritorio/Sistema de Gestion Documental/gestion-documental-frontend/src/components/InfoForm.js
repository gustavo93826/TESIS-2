// admin.js

import React from 'react';
import './InfoForm.css';
import Usuario from './assets/Usuario.svg';
import Clientes from './assets/Clientes.png';
import Permisos from './assets/Permisos.png';
import Registro from './assets/Registro.png';

const info = () => {
  const features = [
    {
      icon: Usuario, // Replace with the path to the icon
      text: "Crear, editar y eliminar usuarios",
    },
    {
      icon: Clientes, // Replace with the path to the icon
      text: "Crear, editar y eliminar clientes",
    },
    {
      icon: Permisos, // Replace with the path to the icon
      text: "Asignar Permisos de Acceso a los usuarios sobre distintos archivos",
    },
    {
      icon: Registro, // Replace with the path to the icon
      text: "Vizualizar las acciones de los usuarios en el sistema",
    },
  ];

  return (
    <div id="admin-container">
      <h1 className="title">Bienvenido Administrador</h1>
      <p className="subtitle">Aquí podrá gestionar varios aspectos del sistema tales como:</p>
      <div className="feature-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <img src={feature.icon} alt={feature.text} className="feature-icon" />
            <p className="feature-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default info;
