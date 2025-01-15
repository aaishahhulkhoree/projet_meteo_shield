import React from 'react';
import '../assets/styles/temperature.css';
import PropTypes from 'prop-types';

const TemperatureAlert = ({ temp }) => {
  const unit = localStorage.getItem('temperatureUnit') || 'C'; // Par défaut, Celsius
  
  // Si l'unité est Celsius, convertir la température en Fahrenheit si nécessaire
  const tempInCelsius = unit === 'C' ? temp : (temp - 32) * (5 / 9); // Conversion de F à C
  const tempInFahrenheit = unit === 'F' ? temp : (tempInCelsius * 9 / 5) + 32; // Conversion de C à F
  
  const displayTemp = unit === 'F' ? Math.round(tempInFahrenheit) : Math.round(tempInCelsius); // Affichage selon l'unité

  let alertContent = null;

  // Logique d'alerte selon l'unité de température et la valeur de temp
  if (unit === 'C') {
    // Si l'unité est Celsius
    if (tempInCelsius > 35) {
      alertContent = (
        <div className="alert temperature-alert extreme-heat">
          <h3>Alerte Chaleur Extrême !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInCelsius > 24 && tempInCelsius <= 35) {
      alertContent = (
        <div className="alert temperature-alert moderate-heat">
          <h3>Alerte Chaleur !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInCelsius < 0) {
      alertContent = (
        <div className="alert temperature-alert extreme-cold">
          <h3>Alerte Froid Extrême !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInCelsius >= 0 && tempInCelsius <= 5) {
      alertContent = (
        <div className="alert temperature-alert moderate-cold">
          <h3>Alerte Froid !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    }
  } else {
    // Si l'unité est Fahrenheit
    if (tempInFahrenheit > 95) {
      alertContent = (
        <div className="alert temperature-alert extreme-heat">
          <h3>Alerte Chaleur Extrême !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInFahrenheit > 86 && tempInFahrenheit <= 95) {
      alertContent = (
        <div className="alert temperature-alert moderate-heat">
          <h3>Alerte Chaleur !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInFahrenheit < 32) {
      alertContent = (
        <div className="alert temperature-alert extreme-cold">
          <h3>Alerte Froid Extrême !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInFahrenheit >= 32 && tempInFahrenheit <= 41) {
      alertContent = (
        <div className="alert temperature-alert moderate-cold">
          <h3>Alerte Froid !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    }
  }

  return <div>{alertContent}</div>;
};

TemperatureAlert.propTypes = {
  temp: PropTypes.number.isRequired, // Température en °C ou °F selon les paramètres
};

export default TemperatureAlert;
