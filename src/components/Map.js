// src/components/Map.js
import React from 'react';
import '../assets/styles/map.css';

const Map = () => {
  return (
    <div className="map-container">
      <div className="map-zone visible" style={{ top: '50px', left: '100px' }}></div>
      <div className="map-zone safety visible" style={{ top: '200px', left: '300px' }}></div>
      {/* Ajouter ici des zones géographiques selon la logique de ton application */}
    </div>
  );
};

export default Map;
