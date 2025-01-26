import React, { useEffect, useState } from 'react';
import '../assets/styles/temperature.css';
import PropTypes from 'prop-types';

const TemperatureAlert = ({ temp }) => {
  const [unit, setUnit] = useState('C'); // Valeur par défaut

  // Charger l'unité de température depuis l'API ou le localStorage
  useEffect(() => {
    const fetchTemperatureUnit = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/preferences-utilisateur/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUnit(data.temperature_unit || 'C');
          } else {
            setUnit(localStorage.getItem('temperatureUnit') || 'C'); // En cas d'erreur, fallback vers localStorage
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'unité de température :', error);
          setUnit(localStorage.getItem('temperatureUnit') || 'C');
        }
      } else {
        setUnit(localStorage.getItem('temperatureUnit') || 'C'); // Utilisateur non connecté
      }
    };

    fetchTemperatureUnit();
  }, []);

  // Si l'unité est Celsius, convertir la température en Fahrenheit si nécessaire
  const tempInCelsius = unit === 'C' ? temp : (temp - 32) * (5 / 9); // Conversion de F à C
  const tempInFahrenheit = unit === 'F' ? temp : (tempInCelsius * 9) / 5 + 32; // Conversion de C à F

  const displayTemp = unit === 'F' ? Math.round(tempInFahrenheit) : Math.round(tempInCelsius); // Affichage selon l'unité

  let alertContent = null;

  // Logique d'alerte selon l'unité de température et la valeur de temp
  if (unit === 'C') {
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
