import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const DroughtAlert = ({ rain, humidity, temp }) => {
  // Vérification si les précipitations sont absentes ou faibles
  const isNoRain = !rain || rain['1h'] < 1; // Moins de 1 mm de pluie dans l'heure
  const isLowHumidity = humidity < 30; // Humidité inférieure à 30%
  const isHighTemp = temp > 30; // Température supérieure à 30°C

  // Si la température est élevée, l'humidité est faible, et il n'y a pas de pluie
  if (isNoRain && isLowHumidity && isHighTemp) {
    return (
      <div className="alert drought-alert">
        <h3>Alerte Sécheresse !</h3>
        <p>Conditions actuelles : température élevée à {temp}°C, humidité faible ({humidity}%), et absence de précipitations. Risque de sécheresse imminent.</p>
      </div>
    );
  }

  // Si la bruine est présente, on ne déclenche pas l'alerte sécheresse
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
