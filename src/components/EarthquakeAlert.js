import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const EarthquakeAlert = ({ earthquakeData, preferences }) => {
  // Vérifie si les données sont présentes et si le tremblement de terre dépasse le seuil de magnitude
  if (earthquakeData && earthquakeData.magnitude >= 8) {
    return (
      <div className="alert earthquake-alert">
        <h3>Alerte Tremblement de Terre !</h3>
        <p>Un tremblement de terre a été détecté.</p>
        <p><strong>Magnitude :</strong> {earthquakeData.magnitude}</p>
        <p><strong>Profondeur :</strong> {earthquakeData.depth} km</p>
        <p><strong>Lieu :</strong> {earthquakeData.location}</p>
      </div>
    );
  }

  return null;
};

// Définir les PropTypes pour valider les props du composant EarthquakeAlert
EarthquakeAlert.propTypes = {
  earthquakeData: PropTypes.shape({
    magnitude: PropTypes.number.isRequired, // magnitude doit être un nombre et est requis
    depth: PropTypes.number.isRequired,     // depth doit être un nombre et est requis
    location: PropTypes.string.isRequired,  // location doit être une chaîne de caractères et est requis
  }).isRequired, // earthquakeData doit être un objet et est requis
  preferences: PropTypes.object, // preferences est un objet, mais il n'est pas nécessairement requis
};

export default EarthquakeAlert;
