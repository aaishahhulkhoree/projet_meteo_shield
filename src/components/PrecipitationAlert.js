import React from 'react';

const PrecipitationAlert = ({ rain }) => {
  // Alerte pour pluie extrême (> 100 mm)
  if (rain && rain['1h'] > 100) {
    return (
      <div className="alert precipitation-alert extreme-rain">
        <h3>Alerte Pluie Extrême !</h3>
        <p>Précipitations torrentielles détectées : {rain['1h']} mm dans la dernière heure. Risque d'inondation imminent.</p>
      </div>
    );
  }

  // Alerte pour pluie forte (50 - 100 mm)
  if (rain && rain['1h'] > 50) {
    return (
      <div className="alert precipitation-alert heavy-rain">
        <h3>Alerte Pluie Forte !</h3>
        <p>Précipitations importantes détectées : {rain['1h']} mm dans la dernière heure. Risque d'inondation possible.</p>
      </div>
    );
  }

  // Alerte pour pluie modérée (20 - 50 mm)
  if (rain && rain['1h'] > 20) {
    return (
      <div className="alert precipitation-alert moderate-rain">
        <h3>Alerte Pluie Modérée !</h3>
        <p>Précipitations modérées détectées : {rain['1h']} mm dans la dernière heure. Préparez-vous à des conditions pluvieuses.</p>
      </div>
    );
  }

  return null;
};

export default PrecipitationAlert;
