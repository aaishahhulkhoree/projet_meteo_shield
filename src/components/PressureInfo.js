// Importation de React et des styles spécifiques pour ce composant
import React from 'react';
// Importation des styles CSS pour ce composant
import '../assets/styles/pressure.css'; 
// Importation de PropTypes pour valider les types de données des props
import PropTypes from 'prop-types';

/**
 * Composant `PressureInfo` qui affiche la pression atmosphérique.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {number} props.pressure - La pression atmosphérique à afficher, en hPa.
 * 
 * @returns {JSX.Element} Le composant contenant un paragraphe avec l'icône et la pression.
 */
const PressureInfo = ({ pressure }) => {
  return (
    <div className="pressure-info">
      {/* Affiche l'icône de vent et la pression en hPa */}
      <p> 🌬️ Pression : {pressure} hPa</p>
    </div>
  );
};

// Définition de PropTypes pour valider que la prop 'pressure' est un nombre
PressureInfo.propTypes = {
  pressure: PropTypes.number.isRequired, // La pression doit être un nombre et est obligatoire
};

// Exportation du composant pour qu'il puisse être utilisé ailleurs dans l'application
export default PressureInfo;
