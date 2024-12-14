import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const StormAlert = ({ windSpeed, windGust, forecastWindSpeed }) => {
  // Condition pour un vent violent
  const isWindStrong = windSpeed > 30; // Vent régulier > 30 km/h
  const isWindGustStrong = windGust > 60; // Rafales de vent > 60 km/h
  const isSevereWindForecast = forecastWindSpeed > 50; // Prévision de vent supérieur à 50 km/h
  
  if (isWindStrong || isWindGustStrong || isSevereWindForecast) {
    return (
      <div className="alert storm-alert">
        <h3>Alerte Tempête !</h3>
        <p>
          {isWindGustStrong 
            ? `Rafales de vent violentes détectées avec une vitesse de ${windGust} km/h.`
            : `Vent violent détecté avec une vitesse de ${windSpeed} km/h.`}
        </p>
        {isSevereWindForecast && <p>Prévisions : vent supérieur à 50 km/h dans les prochaines heures.</p>}
      </div>
    );
  }

  return null;
};

// Définir les PropTypes pour valider les props du composant StormAlert
StormAlert.propTypes = {
  windSpeed: PropTypes.number.isRequired, // windSpeed doit être un nombre et est requis
  windGust: PropTypes.number.isRequired, // windGust doit être un nombre et est requis
  forecastWindSpeed: PropTypes.number.isRequired, // forecastWindSpeed doit être un nombre et est requis
};

export default StormAlert;
