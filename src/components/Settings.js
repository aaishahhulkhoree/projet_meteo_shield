import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState('storm');
  const [useGeolocation, setUseGeolocation] = useState(true); // State pour la géolocalisation (toggle switch)
  const navigate = useNavigate();

  const handleAlertChange = (e) => {
    setAlertType(e.target.value);
  };

  const handleToggleGeolocation = () => {
    setUseGeolocation(!useGeolocation);
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="settings-container">
      {/* Bouton retour à l'accueil */}
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>

      <h1>Paramètres</h1>
      <p>Personnalisez vos préférences d&apos;alerte météo et de géolocalisation.</p>

      <div className="setting-option">
        <label htmlFor="alertType">Type d&apos;alerte météo</label>
        <select 
          id="alertType" 
          value={alertType} 
          onChange={handleAlertChange}
        >
          <option value="storm">Tempête</option>
          <option value="heatwave">Canicule</option>
          <option value="rain">Pluie intense</option>
          <option value="earthquake">Séisme</option>
          <option value="tsunami">Tsunami</option>
        </select>
      </div>

      <div className="setting-option">
        <label htmlFor="geolocation">Géolocalisation</label>
        <div className="toggle-switch">
          <input 
            type="checkbox" 
            id="geolocation" 
            checked={useGeolocation} 
            onChange={handleToggleGeolocation} 
          />
          <label htmlFor="geolocation" className="toggle-label"></label>
        </div>
      </div>

      <div className="button-container">
        <button className="save-button">Sauvegarder</button>
      </div>
    </div>
  );
};

export default Settings;
