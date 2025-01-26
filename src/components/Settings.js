import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('C');
  const [preferredCities, setPreferredCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const navigate = useNavigate();
  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c';

  // Récupérer les préférences et les villes favorites depuis l'API au chargement
  useEffect(() => {
    const fetchPreferencesAndCities = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        // Récupérer les préférences utilisateur
        const preferencesResponse = await fetch(`http://localhost:5000/api/preferences-utilisateur/${userId}`);
        if (preferencesResponse.ok) {
          const preferencesData = await preferencesResponse.json();
          setTemperatureUnit(preferencesData.temperatureUnit || 'C');
          setAlertType(preferencesData.alert_type || []);
        }

        // Récupérer les villes favorites
        const citiesResponse = await fetch(`http://localhost:5000/api/villes-favorites/${userId}`);
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json();
          setPreferredCities(citiesData.villes || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchPreferencesAndCities();
  }, []);

  // Récupération des suggestions de villes
  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      const data = await response.json();

      // Formater les suggestions et supprimer les doublons
      const formattedSuggestions = data
        .map((city) => ({
          name: city.name,
          country: city.country,
        }))
        .filter(
          (suggestion, index, self) =>
            index === self.findIndex((s) => s.name === suggestion.name && s.country === suggestion.country)
        );

      setCitySuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions de villes :', error);
    }
  };
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

  // Gérer les changements de types d'alertes météo
  const handleAlertTypeChange = (e) => {
    const value = e.target.value;
    setAlertType((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  // Sauvegarder les préférences utilisateur (température, alertes) et les villes favorites
  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Vous devez être connecté pour sauvegarder vos préférences.');
      return;
    }

    try {
      // Sauvegarder les préférences utilisateur
      const preferencesResponse = await fetch('http://localhost:5000/api/preferences-utilisateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          temperatureUnit,
          alertType,
        }),
      });

      if (!preferencesResponse.ok) {
        throw new Error('Erreur lors de la sauvegarde des préférences utilisateur.');
      }

      // Sauvegarder les villes favorites
      const citiesResponse = await fetch('http://localhost:5000/api/villes-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          villes: preferredCities,
        }),
      });

      if (!citiesResponse.ok) {
        throw new Error('Erreur lors de la sauvegarde des villes favorites.');
      }

      alert('Préférences sauvegardées avec succès.');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données :', error);
      alert('Une erreur est survenue lors de la sauvegarde.');
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
        <select multiple value={alertType} onChange={handleAlertTypeChange}>
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
          onChange={(e) => {
            const value = e.target.value;
            setCityInput(value);
            fetchCitySuggestions(value);
          }}
          placeholder="Ajoutez une ville"
        />
        <div className="city-suggestions">
          {citySuggestions.map((city, index) => (
            <div
              key={index}
              onClick={() => handleAddCity(city)}
              className="suggestion-item"
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
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
