import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes pour valider les types des props

/**
 * Composant DroughtAlert qui affiche une alerte en cas de risque de sécheresse.
 * Il se base sur l'absence de pluie, une faible humidité et une température élevée.
 *
 * @param {Object} rain - Objet contenant les données de précipitations.
 * @param {number} rain - rain['1h'] La quantité de pluie en mm durant la dernière heure.
 * @param {number} humidity - Pourcentage d'humidité relative.
 * @param {number} temp - Température actuelle en degrés Celsius.
 * @returns {JSX.Element|null} - Retourne une alerte en cas de sécheresse ou null si aucun risque.
 */
const DroughtAlert = ({ rain, humidity, temp }) => {

  // Vérification si les précipitations sont absentes ou faibles
  const isNoRain = !rain || rain['1h'] < 1; // Moins de 1 mm de pluie dans l'heure
  const isLowHumidity = humidity < 30; // Humidité inférieure à 30%
  const isHighTemp = temp > 30; // Température supérieure à 30°C
  const precipitation = rain['1h'] || 0; // Vérifier si la clé '1h' existe
  // Condition stricte pour un risque de sécheresse élevé
  if (precipitation < 2 && humidity < 30 && temp > 30) {
    return <p className="alert-drought">⚠️ Risque de sécheresse élevé !</p>;
  }
  // Condition générale pour afficher une alerte sécheresse si toutes les conditions sont réunies
  if (isNoRain && isLowHumidity && isHighTemp) {
    return (
      <div className="alert drought-alert">
        <h3>Alerte Sécheresse !</h3>
        <p>Conditions actuelles : température élevée à {temp}°C, humidité faible ({humidity}%), et absence de précipitations. Risque de sécheresse imminent.</p>
      </div>
    );
  }

  // Si la pluie est présente en quantité significative (>= 1 mm), on ne déclenche pas l'alerte sécheresse
  if (rain && rain['1h'] >= 1) {
    return null; // Pas de sécheresse, il y a des précipitations
  }

  // Si l'humidité est suffisante et les conditions sont normales, pas d'alerte sécheresse
  return null;
};

// Définir les PropTypes pour valider les props du composant DroughtAlert
DroughtAlert.propTypes = {
  rain: PropTypes.shape({
    '1h': PropTypes.number,  // La quantité de pluie dans la dernière heure
  }).isRequired, // rain est un objet avec une propriété '1h' (nombre de mm) et est requis
  humidity: PropTypes.number.isRequired,  // L'humidité est un nombre
  temp: PropTypes.number.isRequired, // La température est un nombre
};

export default DroughtAlert;
