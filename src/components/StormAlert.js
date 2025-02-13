import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes
import WindSpeedInfo from './WindSpeedInfo'; // Import de WindSpeedInfo
import '../assets/styles/alert.css';

/**
 * Composant StormAlert qui affiche une alerte en cas de conditions météorologiques sévères, spécifiquement des vents forts ou violents.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.windSpeed - La vitesse actuelle du vent en km/h.
 * @param {number} props.forecastWindSpeed - La vitesse prévue du vent en km/h dans les prochaines heures.
 * 
 * @returns {JSX.Element | null} - Retourne un élément JSX affichant une alerte si les conditions sont remplies, sinon retourne null.
 */
const StormAlert = ({ windSpeed, forecastWindSpeed }) => {
  // Condition pour un vent violent ou rafales fortes
  const isWindStrong = windSpeed > 30; // Vent régulier > 30 km/h
  const isWindGustStrong = windSpeed > 60; // Rafales de vent > 60 km/h
  const isSevereWindForecast = forecastWindSpeed > 50; // Prévision de vent supérieur à 50 km/h

  /**
   * Vérifie si l'alerte tempête doit être affichée.
   * 
   * @returns {JSX.Element | null} - Affiche l'alerte tempête avec des informations sur le vent si une condition est remplie.
   * Retourne null si aucune condition n'est remplie.
   */
  if (isWindStrong || isWindGustStrong || isSevereWindForecast) {
    return (
      <div className="alert storm-alert">
        <h3>Alerte Tempête !</h3>
        <p>
          {isWindGustStrong 
            ? `Rafales de vent violentes détectées avec une vitesse de ${Math.round(windSpeed)} km/h.`
            : `Vent violent détecté avec une vitesse de ${Math.round(windSpeed)} km/h.`}
        </p>
        {isSevereWindForecast && <p>Prévisions : vent supérieur à 50 km/h dans les prochaines heures.</p>}

        {/* Utilisation du composant WindSpeedInfo pour afficher la vitesse du vent */}
        <WindSpeedInfo windSpeed={windSpeed} />
      </div>
    );
  }

  // Retourne null si aucune condition n'est remplie
  return null;
};

/**
 * PropTypes pour valider les propriétés passées au composant.
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.windSpeed - La vitesse actuelle du vent.
 * @param {number} props.forecastWindSpeed - La vitesse prévue du vent dans les prochaines heures.
 */
StormAlert.propTypes = {
  windSpeed: PropTypes.number.isRequired, // windSpeed doit être un nombre et est requis
  forecastWindSpeed: PropTypes.number.isRequired, // forecastWindSpeed doit être un nombre et est requis
};

export default StormAlert;
