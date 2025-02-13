import React, { useEffect, useState } from 'react';
import '../assets/styles/temperature.css';
import PropTypes from 'prop-types';

/**
 * Composant TemperatureAlert qui affiche des alertes de température selon l'unité et la température actuelle.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.temp - La température actuelle en °C ou °F.
 * 
 * @returns {JSX.Element} - Retourne un élément JSX affichant une alerte de température ou null si aucune alerte n'est nécessaire.
 */
const TemperatureAlert = ({ temp }) => {
  const [unit, setUnit] = useState('C'); // Valeur par défaut de l'unité

  /**
   * Utilisation du hook useEffect pour récupérer l'unité de température préférée de l'utilisateur depuis l'API ou le localStorage.
   * 
   * @returns {void} - Aucun retour, mais met à jour l'état de l'unité avec la valeur récupérée.
   */
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

  // Conversion des températures selon l'unité choisie (Celsius ou Fahrenheit)
  const tempInCelsius = unit === 'C' ? temp : (temp - 32) * (5 / 9); // Conversion de F à C
  const tempInFahrenheit = unit === 'F' ? temp : (tempInCelsius * 9) / 5 + 32; // Conversion de C à F

  const displayTemp = unit === 'F' ? Math.round(tempInFahrenheit) : Math.round(tempInCelsius); // Affichage selon l'unité

  let alertContent = null;

  /**
   * Logique d'affichage d'alertes selon l'unité de température et la valeur de temp.
   * Cette logique crée des alertes spécifiques pour différentes gammes de températures en Celsius ou Fahrenheit.
   * 
   * @returns {JSX.Element | null} - Retourne l'alerte correspondante ou null si aucune condition n'est remplie.
   */
  if (unit === 'C') {
    if (tempInCelsius > 28) {
      alertContent = (
        <div className="alert temperature-alert extreme-heat">
          <h3>Alerte Chaleur Extrême !</h3>
          <p>Température actuelle : {displayTemp}°{unit}</p>
        </div>
      );
    } else if (tempInCelsius > 20 && tempInCelsius <= 35) {
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
    } else if (tempInCelsius >= 0 && tempInCelsius <= 10) {
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

/**
 * Définition des PropTypes pour valider les propriétés du composant.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.temp - La température en °C ou °F.
 */
TemperatureAlert.propTypes = {
  temp: PropTypes.number.isRequired, // Température en °C ou °F selon les paramètres
  unit : PropTypes.string.isRequired,
};

export default TemperatureAlert;
