import React from 'react';

const TemperatureAlert = ({ temp }) => {
  // Alerte pour chaleur extrême
  if (temp > 35) {
    return (
      <div className="alert temperature-alert extreme-heat">
        <h3>Alerte Chaleur Extrême !</h3>
        <p>Température exacte : {temp}°C. Risque de chaleur extrême. Protégez-vous !</p>
      </div>
    );
  }

  // Alerte pour chaleur modérée (entre 30°C et 35°C)
  if (temp > 30 && temp <= 35) {
    return (
      <div className="alert temperature-alert moderate-heat">
        <h3>Alerte Chaleur !</h3>
        <p>Température exacte : {temp}°C. Risque de chaleur modérée. Buvez beaucoup d'eau !</p>
      </div>
    );
  }

  // Alerte pour le gel (en dessous de 0°C)
  if (temp < 0) {
    return (
      <div className="alert temperature-alert extreme-cold">
        <h3>Alerte Froid Extrême !</h3>
        <p>Température exacte : {temp}°C. Risque de gel important.</p>
      </div>
    );
  }

  // Alerte pour froid modéré (entre 0°C et 5°C)
  if (temp >= 0 && temp <= 5) {
    return (
      <div className="alert temperature-alert moderate-cold">
        <h3>Alerte Froid !</h3>
        <p>Température exacte : {temp}°C. Risque de gel modéré.</p>
      </div>
    );
  }

  return null;
};

export default TemperatureAlert;
