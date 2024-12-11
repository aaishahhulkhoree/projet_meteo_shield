import React from 'react';

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

export default LocationAlert;
