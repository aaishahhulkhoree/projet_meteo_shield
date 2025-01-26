import React from 'react';
import '../assets/styles/windspeed.css'
import PropTypes from 'prop-types'; // Import de PropTypes

const WindSpeedInfo = ({ windSpeed }) => {

  if (windSpeed !== undefined) {
    return (
      <div className="windspeed-info"> 
      <p>💨 {Math.round(windSpeed)} km/h</p>
      </div>
    );
  }
  return null;
};


// Validation des props
WindSpeedInfo.propTypes = {
  windSpeed: PropTypes.number, // windSpeed doit être un nombre
};

export default WindSpeedInfo;
