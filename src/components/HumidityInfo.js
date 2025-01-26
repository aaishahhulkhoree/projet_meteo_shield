import React from 'react';
import '../assets/styles/humidity.css'; 
import PropTypes from 'prop-types';

const HumidityInfo = ({ humidity }) => {
  return (
    <div className="humidity-info">
      <p> 💧 Humidité : {humidity}%</p>
    </div>
  );
};

HumidityInfo.propTypes = {
  humidity: PropTypes.number.isRequired,
};

export default HumidityInfo;
