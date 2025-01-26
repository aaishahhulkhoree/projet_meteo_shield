import React, { useState } from 'react';
import EarthquakeAlert from '../EarthquakeAlert.js';

const TestEarthquakeAlert = () => {
  const [earthquakeData, setEarthquakeData] = useState(null);

  return (
    <div>
      <h2>Test du Composant EarthquakeAlert</h2>
      <button onClick={() => setEarthquakeData({ magnitude: 8.5, depth: 20, location: 'San Francisco' })}>
        Simuler un tremblement de terre fort
      </button>
      <button onClick={() => setEarthquakeData({ magnitude: 5, depth: 10, location: 'Tokyo' })}>
        Simuler un tremblement de terre faible
      </button>
      <button onClick={() => setEarthquakeData(null)}>Réinitialiser</button>

      <EarthquakeAlert earthquakeData={earthquakeData} />
    </div>
  );
};

export default TestEarthquakeAlert;
