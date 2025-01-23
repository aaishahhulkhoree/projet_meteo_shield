import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState('storm');
  const [temperatureUnit, setTemperatureUnit] = useState(
    localStorage.getItem('temperatureUnit') || 'C'
  );
  const [preferredCities, setPreferredCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const navigate = useNavigate();

  // Charger les villes favorites depuis l'API au chargement
  useEffect(() => {
    const fetchPreferredCities = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setPreferredCities([]); // Réinitialiser les villes favorites si non connecté
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/villes-favorites/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPreferredCities(data.villes || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des villes favorites :', error);
      }
    };

    fetchPreferredCities();
  }, []);

  // Ajouter une ville à la liste
  const handleAddCity = () => {
    if (!cityInput.trim()) {
      alert('Veuillez entrer un nom de ville valide.');
      return;
    }

    if (!preferredCities.includes(cityInput)) {
      setPreferredCities((prev) => [...prev, cityInput]);
    }
    setCityInput('');
  };

  // Supprimer une ville de la liste
  const handleRemoveCity = (cityName) => {
    setPreferredCities((prev) => prev.filter((city) => city !== cityName));
  };

  // Sauvegarder les préférences (villes favorites) via l'API
  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Vous devez être connecté pour sauvegarder vos préférences.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/villes-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, villes: preferredCities }),
      });

      if (response.ok) {
        alert('Préférences sauvegardées avec succès.');
        navigate('/');
      } else {
        alert('Erreur lors de la sauvegarde des préférences.');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences :', error);
    }
  };

  // Retour à l'accueil
  const goHome = () => navigate('/');

  return (
    <div className="settings-container">
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>
      <h1>Paramètres</h1>
      <div className="setting-option">
        <label>Unité de température :</label>
        <select value={temperatureUnit} onChange={(e) => setTemperatureUnit(e.target.value)}>
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
        </select>
      </div>
      <div className="setting-option">
        <label>Type d&apos;alerte météo :</label>
        <select value={alertType} onChange={(e) => setAlertType(e.target.value)}>
          <option value="storm">Tempête</option>
          <option value="heatwave">Canicule</option>
          <option value="rain">Pluie intense</option>
          <option value="earthquake">Séisme</option>
          <option value="tsunami">Tsunami</option>
        </select>
      </div>
      <div className="setting-option">
        <h3>Villes préférées :</h3>
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Ajoutez une ville"
        />
        <button className="add-button" onClick={handleAddCity}>Ajouter</button>
        <ul>
          {preferredCities.map((city, index) => (
            <li key={index}>
              {city}
              <button className="delete-button" onClick={() => handleRemoveCity(city)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
      <button className="save-button" onClick={handleSave}>Sauvegarder</button>
    </div>
  );
};

export default Settings;
