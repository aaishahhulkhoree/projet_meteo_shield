import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes pour la validation des props

/**
 * Composant LocationAlert
 * Ce composant affiche une alerte météorologique si la ville actuelle est incluse dans les préférences utilisateur.
 *
 * @param {Object} props - Propriétés du composant
 * @param {string} props.city - Nom de la ville à vérifier
 * @param {Object} props.userPreferences - Préférences de l'utilisateur, incluant les villes suivies
 * @param {string[]} props.userPreferences.cities - Liste des villes suivies par l'utilisateur
 *
 * @returns {JSX.Element|null} - Un message d'alerte si la ville est suivie, sinon null
 */
const LocationAlert = ({ city, userPreferences }) => {
  // Vérifie si la ville actuelle est suivie par l'utilisateur
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
