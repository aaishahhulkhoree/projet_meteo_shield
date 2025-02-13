import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes pour la validation des props
import '../assets/styles/windspeed.css'; // Importation du fichier de style spécifique pour la vitesse du vent

// Composant WindSpeedInfo qui affiche la vitesse du vent en km/h
const WindSpeedInfo = ({ windSpeed }) => {

  // Si la vitesse du vent est définie, afficher la valeur
  if (windSpeed !== undefined) {
    return (
      <div className="windspeed-info"> 
        {/* Affiche la vitesse du vent sous forme d'un texte avec l'icône 💨 */}
        <p>💨 {Math.round(windSpeed)} km/h</p>
      </div>
    );
  }

  // Si la vitesse du vent n'est pas définie, ne rien afficher
  return null;
};

// Validation des props du composant
// windSpeed doit être un nombre, car il représente la vitesse du vent
WindSpeedInfo.propTypes = {
  windSpeed: PropTypes.number, // windSpeed doit être un nombre
};

export default WindSpeedInfo; // Exportation du composant pour l'utiliser dans d'autres fichiers
