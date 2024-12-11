import React from 'react';

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

export default DroughtAlert;
