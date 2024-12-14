import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const LocationAlert = ({ city, userPreferences }) => {
  if (userPreferences.cities.includes(city)) {
    return (
      <div className="alert location-alert">
        <h3>Alerte pour votre ville !</h3>
        <p>Un événement météorologique affecte {city}.</p>
      </div>
    );
  }
  return null;
};

// Définir les PropTypes pour valider les props du composant LocationAlert
LocationAlert.propTypes = {
  city: PropTypes.string.isRequired, // city doit être une chaîne de caractères et est requis
  userPreferences: PropTypes.shape({
    cities: PropTypes.arrayOf(PropTypes.string).isRequired, // cities est un tableau de chaînes de caractères et est requis
  }).isRequired, // userPreferences doit être un objet et est requis
};

export default LocationAlert;
