import React from 'react';
import '../assets/styles/temperature.css';
import PropTypes from 'prop-types';

const TemperatureAlert = ({ temp }) => {
  // Température en °C utilisée pour l'évaluation des alertes
  const tempInCelsius = temp;

  // Température affichée en Celsius
  const displayTemp = Math.round(tempInCelsius);

  // Rendu de l'alerte en fonction de la température en °C
  let alertContent = null;

  if (tempInCelsius > 35) {
    alertContent = (
      <div className="alert temperature-alert extreme-heat">
        <h3>Alerte Chaleur Extrême !</h3>
        <p>
          Température actuelle : {displayTemp}°C. Risque de chaleur extrême. Protégez-vous !
        </p>
      </div>
    );
  } else if (tempInCelsius > 30 && tempInCelsius <= 35) {
    alertContent = (
      <div className="alert temperature-alert moderate-heat">
        <h3>Alerte Chaleur !</h3>
        <p>
          Température actuelle : {displayTemp}°C. Risque de chaleur modérée. Buvez beaucoup d&apos;eau !
        </p>
      </div>
    );
  } else if (tempInCelsius < 0) {
    alertContent = (
      <div className="alert temperature-alert extreme-cold">
        <h3>Alerte Froid Extrême !</h3>
        <p>
          Température actuelle : {displayTemp}°C. Risque de gel important.
        </p>
      </div>
    );
  } else if (tempInCelsius >= 0 && tempInCelsius <= 5) {
    alertContent = (
      <div className="alert temperature-alert moderate-cold">
        <h3>Alerte Froid !</h3>
        <p>
          Température actuelle : {displayTemp}°C. Risque de gel modéré.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Affichage de l'alerte s'il y en a */}
      {alertContent}

    </div>
  );
};

TemperatureAlert.propTypes = {
  temp: PropTypes.number.isRequired, // Température en °C
};

export default TemperatureAlert;
