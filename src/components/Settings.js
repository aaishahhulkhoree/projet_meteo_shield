import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState('storm');
  const [location, setLocation] = useState('current');
  const navigate = useNavigate();

  const handleAlertChange = (e) => {
    setAlertType(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
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
      <p>Personnalisez vos préférences d&apos;alerte météo et géolocalisation.</p>
      
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
        <label htmlFor="location">Localisation</label>
        <select 
          id="location" 
          value={location} 
          onChange={handleLocationChange}
        >
          <option value="current">Ma position actuelle</option>
          <option value="manual">Choisir une ville</option>
        </select>
      </div>

      <div className="button-container">
        <button className="save-button">Sauvegarder</button>
      </div>
    </div>
  );
};

export default Settings;
