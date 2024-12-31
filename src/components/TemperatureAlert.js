import React, { useState } from 'react';
import '../assets/styles/temperature.css';
import PropTypes from 'prop-types';

const TemperatureAlert = ({ temp, initialUnit }) => {
  // État pour suivre l'unité sélectionnée
  const [unit, setUnit] = useState(initialUnit || 'C'); // 'C' pour Celsius, 'F' pour Fahrenheit

  // Fonction de conversion Celsius → Fahrenheit
  const convertToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;
  const convertToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

  // Température en °C utilisée pour l'évaluation des alertes
  const tempInCelsius = unit === 'F' ? convertToCelsius(temp) : temp;

  // Température affichée en fonction de l'unité sélectionnée
  const displayTemp = unit === 'C' ? Math.round(temp) : Math.round(convertToFahrenheit(temp));

  // Rendu de l'alerte en fonction de la température en °C
  let alertContent = null;

  if (tempInCelsius > 35) {
    alertContent = (
      <div className="alert temperature-alert extreme-heat">
        <h3>Alerte Chaleur Extrême !</h3>
        <p>
          Température actuelle : {displayTemp}°{unit}. Risque de chaleur extrême. Protégez-vous !
        </p>
      </div>
    );
  } else if (tempInCelsius > 30 && tempInCelsius <= 35) {
    alertContent = (
      <div className="alert temperature-alert moderate-heat">
        <h3>Alerte Chaleur !</h3>
        <p>
          Température actuelle : {displayTemp}°{unit}. Risque de chaleur modérée. Buvez beaucoup d&apos;eau !
        </p>
      </div>
    );
  } else if (tempInCelsius < 0) {
    alertContent = (
      <div className="alert temperature-alert extreme-cold">
        <h3>Alerte Froid Extrême !</h3>
        <p>
          Température actuelle : {displayTemp}°{unit}. Risque de gel important.
        </p>
      </div>
    );
  } else if (tempInCelsius >= 0 && tempInCelsius <= 5) {
    alertContent = (
      <div className="alert temperature-alert moderate-cold">
        <h3>Alerte Froid !</h3>
        <p>
          Température actuelle : {displayTemp}°{unit}. Risque de gel modéré.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Toggle Switch pour l'unité */}
      <div className="unit-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={unit === 'F'}
            onChange={() => setUnit(unit === 'C' ? 'F' : 'C')}
          />
          <span className="slider"></span>
        </label>
        <span className="unit-label">{unit === 'C' ? '°C' : '°F'}</span>
      </div>

      {/* Affichage de l'alerte s'il y en a */}
      {alertContent}

      {/* Température actuelle si aucune alerte */}
      {!alertContent && (
        <div>
          <p>Température actuelle : {displayTemp}°{unit}</p>
          <p>Aucune alerte météo pour le moment.</p>
        </div>
      )}
    </div>
  );
};

TemperatureAlert.propTypes = {
  temp: PropTypes.number.isRequired,
  initialUnit: PropTypes.string, // Unité de départ ('C' ou 'F')
};

export default TemperatureAlert;
