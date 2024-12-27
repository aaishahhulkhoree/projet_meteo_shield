import React from 'react';
import '../assets/styles/pressure.css'; 
import PropTypes from 'prop-types';

const PressureInfo = ({ pressure }) => {
  return (
    <div className="pressure-info">
      <p>Pression : {pressure} hPa</p>
    </div>
  );
};

PressureInfo.propTypes = {
  pressure: PropTypes.number.isRequired,
};

export default PressureInfo;
