import React from 'react';
import '../assets/styles/temperature.css';
import PropTypes from 'prop-types';

const TemperatureAlert = ({ temp }) => {
  const tempInCelsius = temp;

  // Si la température est en Fahrenheit, on la convertit
  const displayTemp = Math.round(tempInCelsius);

  let alertContent = null;

  if (displayTemp > 95) {
    alertContent = (
      <div className="alert temperature-alert extreme-heat">
        <h3>Alerte Chaleur Extrême !</h3>
        <p>Température actuelle : {displayTemp}°{localStorage.getItem('temperatureUnit')}</p>
      </div>
    );
  } else if (displayTemp > 86 && displayTemp <= 95) {
    alertContent = (
      <div className="alert temperature-alert moderate-heat">
        <h3>Alerte Chaleur !</h3>
        <p>Température actuelle : {displayTemp}°{localStorage.getItem('temperatureUnit')}</p>
      </div>
    );
  } else if (displayTemp < 32) {
    alertContent = (
      <div className="alert temperature-alert extreme-cold">
        <h3>Alerte Froid Extrême !</h3>
        <p>Température actuelle : {displayTemp}°{localStorage.getItem('temperatureUnit')}</p>
      </div>
    );
  } else if (displayTemp >= 32 && displayTemp <= 41) {
    alertContent = (
      <div className="alert temperature-alert moderate-cold">
        <h3>Alerte Froid !</h3>
        <p>Température actuelle : {displayTemp}°{localStorage.getItem('temperatureUnit')}</p>
      </div>
    );
  }

  return (
    <div>
      {alertContent}
    </div>
  );
};

TemperatureAlert.propTypes = {
  temp: PropTypes.number.isRequired, // Température en °C ou °F selon les paramètres
};

export default TemperatureAlert;
