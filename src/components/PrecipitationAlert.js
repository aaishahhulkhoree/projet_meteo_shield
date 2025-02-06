import React from 'react';
import "../assets/styles/precipitation.css"; // Importation des styles pour l'alerte
import PropTypes from 'prop-types'; // Importation de PropTypes pour la validation des props

/**
 * Composant PrecipitationAlert
 * 
 * Entrée : 
 * - 'rain' : Objet contenant les précipitations en mm pendant la dernière heure, sous la forme { '1h': <valeur> }.
 * 
 * Sortie :
 * - Retourne un élément <div> contenant une alerte spécifique (pluie extrême, forte ou modérée) basée sur la valeur de 'rain['1h']'.
 * - Si aucune alerte n'est nécessaire, retourne null pour ne rien afficher.
 * 
 * Description : 
 * Ce composant vérifie la quantité de pluie sur la dernière heure et génère une alerte adaptée. 
 * Si la quantité de pluie dépasse des seuils spécifiques, une alerte correspondante est affichée à l'utilisateur.
 */
const PrecipitationAlert = ({ rain }) => {
  // Alerte pour pluie extrême (> 100 mm)
  // Si les précipitations dans la dernière heure sont supérieures à 100 mm, afficher une alerte pour pluie extrême
  if (rain && rain['1h'] > 100) {
    return (
      <div className="alert precipitation-alert extreme-rain">
        <h3>Alerte Pluie Extrême !</h3>
        <p>Précipitations torrentielles détectées : {rain['1h']} mm dans la dernière heure. Risque d&apos;inondation imminent.</p>
      </div>
    );
  }

  // Alerte pour pluie forte (50 - 100 mm)
  // Si les précipitations dans la dernière heure sont comprises entre 50 mm et 100 mm, afficher une alerte pour pluie forte
  if (rain && rain['1h'] > 50) {
    return (
      <div className="alert precipitation-alert heavy-rain">
        <h3>Alerte Pluie Forte !</h3>
        <p>Précipitations importantes détectées : {rain['1h']} mm dans la dernière heure. Risque d&apos;inondation possible.</p>
      </div>
    );
  }

  // Alerte pour pluie modérée (20 - 50 mm)
  // Si les précipitations dans la dernière heure sont comprises entre 20 mm et 50 mm, afficher une alerte pour pluie modérée
  if (rain && rain['1h'] > 20) {
    return (
      <div className="alert precipitation-alert moderate-rain">
        <h3>Alerte Pluie Modérée !</h3>
        <p>Précipitations modérées détectées : {rain['1h']} mm dans la dernière heure. Préparez-vous à des conditions pluvieuses.</p>
      </div>
    );
  }

  // Si aucune des conditions ci-dessus n'est remplie, ne rien afficher
  return null;
};

/**
 * Validation des props
 * 
 * Entrée :
 * - 'rain' : un objet contenant la clé '1h' qui représente les précipitations en mm de la dernière heure.
 * 
 * Sortie :
 * - Vérifie que la propriété 'rain' est présente et que 'rain['1h']' est un nombre.
 * 
 * Description : 
 * Cette validation garantit que les données passées à ce composant sont conformes aux attentes pour éviter des erreurs.
 */
PrecipitationAlert.propTypes = {
  rain: PropTypes.shape({
    '1h': PropTypes.number, // Validation pour rain['1h'], qui doit être un nombre
  }).isRequired, // Cette prop est obligatoire
};

export default PrecipitationAlert;  // Export du composant pour qu'il puisse être utilisé ailleurs dans l'application
