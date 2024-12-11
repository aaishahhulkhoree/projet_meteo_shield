import React from 'react';

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

export default StormAlert;
