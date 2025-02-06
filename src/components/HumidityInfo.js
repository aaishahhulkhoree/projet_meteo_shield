import React from 'react';
import '../assets/styles/humidity.css'; 
import PropTypes from 'prop-types';

/**
 * Composant affichant les informations sur l'humidité.
 * 
 * Ce composant prend un niveau d'humidité en pourcentage et l'affiche
 * dans une boîte d'information avec une icône en forme de goutte d'eau.
 * 
 * @component
 * @example
 * // Exemple d'utilisation :
 * <HumidityInfo humidity={75} />
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.humidity - Le pourcentage d'humidité à afficher
 * @returns {JSX.Element} Un élément affichant l'humidité avec une icône
 */

const HumidityInfo = ({ humidity }) => {
  return (
    <div className="humidity-info">
      <p> 💧 Humidité : {humidity}%</p>
    </div>
  );
};

// Définition des types de propriétés pour s'assurer que humidity est un nombre requis
HumidityInfo.propTypes = {
  humidity: PropTypes.number.isRequired,
};

export default HumidityInfo;
