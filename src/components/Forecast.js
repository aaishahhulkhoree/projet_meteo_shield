// src/components/Forecast.js
import React from 'react';
import '../assets/styles/forecast.css';

const Forecast = () => {
  return (
    <div className="forecast-container">
      <div className="forecast-card">
        <h4>Demain</h4>
        <div className="icon">☀️</div>
        <p className="temperature">26°C</p>
        <p>Ensoleillé</p>
      </div>
      <div className="forecast-card">
        <h4>Après-demain</h4>
        <div className="icon">🌧️</div>
        <p className="temperature">18°C</p>
        <p>Pluie légère</p>
      </div>
      {/* Ajouter d'autres prévisions selon les besoins */}
    </div>
  );
};

export default Forecast;
