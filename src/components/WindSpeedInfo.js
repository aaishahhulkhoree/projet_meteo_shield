import React from 'react';

const WindSpeedInfo = ({ windSpeed }) => {
  if (windSpeed !== undefined) {
    return (
      <div className="windspeed-info">
        <h3>Vitesse du vent :</h3>
        <p>{windSpeed} km/h</p>
      </div>
    );
  }
  return null;
};

export default WindSpeedInfo;
