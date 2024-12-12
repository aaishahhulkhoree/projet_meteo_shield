import React, { useState } from 'react';

const TemperatureAlert = ({ temp }) => {
  // État pour suivre l'unité sélectionnée (Celsius par défaut)
  const [unit, setUnit] = useState('C'); // 'C' pour Celsius, 'F' pour Fahrenheit

  // Fonction de conversion Celsius → Fahrenheit
  const convertToFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  // Température affichée en fonction de l'unité sélectionnée
  const displayTemp = unit === 'C' ? Math.round(temp) : Math.round(convertToFahrenheit(temp));

  // Alerte pour chaleur extrême
  if (temp > 35) {
    return (
      <div className="alert temperature-alert extreme-heat">
        <h3>Alerte Chaleur Extrême !</h3>
        <p>Température exacte : {displayTemp}°{unit}. Risque de chaleur extrême. Protégez-vous !</p>
      </div>
    );
  }

  // Alerte pour chaleur modérée (entre 30°C et 35°C)
  if (temp > 30 && temp <= 35) {
    return (
      <div className="alert temperature-alert moderate-heat">
        <h3>Alerte Chaleur !</h3>
        <p>Température exacte : {displayTemp}°{unit}. Risque de chaleur modérée. Buvez beaucoup d'eau !</p>
      </div>
    );
  }

  // Alerte pour le gel (en dessous de 0°C)
  if (temp < 0) {
    return (
      <div className="alert temperature-alert extreme-cold">
        <h3>Alerte Froid Extrême !</h3>
        <p>Température exacte : {displayTemp}°{unit}. Risque de gel important.</p>
      </div>
    );
  }

  // Alerte pour froid modéré (entre 0°C et 5°C)
  if (temp >= 0 && temp <= 5) {
    return (
      <div className="alert temperature-alert moderate-cold">
        <h3>Alerte Froid !</h3>
        <p>Température exacte : {displayTemp}°{unit}. Risque de gel modéré.</p>
      </div>
    );
  }

  // Composant de sélection d'unité et affichage de la température
  return (
    <div>
      <div className="unit-switch">
        <button 
          className={unit === 'C' ? 'active' : ''} 
          onClick={() => setUnit('C')}
        >
          °C
        </button>
        <button 
          className={unit === 'F' ? 'active' : ''} 
          onClick={() => setUnit('F')}
        >
          °F
        </button>
      </div>
      <p>Température actuelle : {displayTemp}°{unit}</p>
      <p>Aucune alerte météo pour le moment.</p>
    </div>
  );
};

export default TemperatureAlert;
