import React from 'react';

const EarthquakeAlert = ({ earthquakeData, preferences }) => {
  // Vérifie si les données sont présentes et si le tremblement de terre dépasse le seuil de magnitude
  if (earthquakeData && earthquakeData.magnitude >= 8) {
    return (
      <div className="alert earthquake-alert">
        <h3>Alerte Tremblement de Terre !</h3>
        <p>Un tremblement de terre a été détecté.</p>
        <p><strong>Magnitude :</strong> {earthquakeData.magnitude}</p>
        <p><strong>Profondeur :</strong> {earthquakeData.depth} km</p>
        <p><strong>Lieu :</strong> {earthquakeData.location}</p>
      </div>
    );
  }

  return null;
};

export default EarthquakeAlert;
