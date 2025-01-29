import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState([]);
  const [temperatureUnit, setTemperatureUnit] = useState(
    localStorage.getItem('temperatureUnit') || 'C'
  );
  const [preferredCities, setPreferredCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const navigate = useNavigate();
  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c';

  useEffect(() => {
    const fetchPreferencesAndCities = async () => {
      const userId = localStorage.getItem('userId');
      setIsUserConnected(!!userId);
      if (!userId) {
        const storedTemperatureUnit = localStorage.getItem('temperatureUnit') || 'C';
        setTemperatureUnit(storedTemperatureUnit);
      }
      else {
        try {
          const preferencesResponse = await fetch(`http://localhost:5000/api/preferences-utilisateur/${userId}`);
          if (preferencesResponse.ok) {
            const preferencesData = await preferencesResponse.json();
            setTemperatureUnit(preferencesData.temperatureUnit || 'C');
            setAlertType(preferencesData.alertType || []);
          }
  
          const citiesResponse = await fetch(`http://localhost:5000/api/villes-favorites/${userId}`);
          if (citiesResponse.ok) {
            const citiesData = await citiesResponse.json();
            setPreferredCities(citiesData.villes || []);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      }
    };

    fetchPreferencesAndCities();
  }, []);

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

      const uniqueSuggestions = data
        .map((city) => ({
          name: city.name,
          country: city.country,
        }))
        .filter(
          (city, index, self) =>
            index === self.findIndex(
              (c) => c.name === city.name && c.country === city.country
            )
        );

      setCitySuggestions(uniqueSuggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions de villes :', error);
    }
  };

  const handleAddCity = (city) => {
    if (!preferredCities.includes(city.name)) {
      setPreferredCities((prev) => [...prev, city.name]);
    }
    setCityInput('');
    setCitySuggestions([]);
  };

  const handleRemoveCity = (cityName) => {
    setPreferredCities((prev) => prev.filter((city) => city !== cityName));
  };

  const handleToggleAlert = (alert) => {
    setAlertType((prevAlerts) =>
      prevAlerts.includes(alert)
        ? prevAlerts.filter((a) => a !== alert) // Supprime si déjà présent
        : [...prevAlerts, alert] // Ajoute si non présent
    );
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Sauvegarde dans le localStorage pour un utilisateur non connecté
      localStorage.setItem('temperatureUnit', temperatureUnit);
      alert('Préférences sauvegardées localement.');
      navigate('/');
    }
    else {
      try {
        const preferencesResponse = await fetch('http://localhost:5000/api/preferences-utilisateur', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            temperatureUnit,
            alertType,
          }),
        });
  
        const citiesResponse = await fetch('http://localhost:5000/api/villes-favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            villes: preferredCities,
          }),
        });
  
        if (preferencesResponse.ok && citiesResponse.ok) {
          alert('Préférences sauvegardées avec succès.');
          navigate('/');
        } else {
          alert('Erreur lors de la sauvegarde des préférences.');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des préférences :', error);
      }
    }
  };

  const goHome = () => navigate('/');

  return (
    <div className="settings-container">
      <button className="home-btn" onClick={goHome}> <span> Retour à l&apos;accueil</span></button>
      <h1>Paramètres</h1>
      <div className="setting-option">
        <label>Unité de température :</label>
        <select value={temperatureUnit} onChange={(e) => setTemperatureUnit(e.target.value)}>
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
        </select>
      </div>
      {isUserConnected && (
        <div className="setting-option">
          <label>Type d&apos;alerte météo :</label>
          <div className="alert-options">
            {["storm", "heatwave", "rain", "earthquake", "tsunami"].map((alert) => (
              <button
                key={alert}
                className={`alert-button ${alertType.includes(alert) ? "selected" : ""}`}
                onClick={() => handleToggleAlert(alert)}
              >
                {alert.charAt(0).toUpperCase() + alert.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      {isUserConnected && (
      <div className="setting-option">
        <h3>Villes préférées :</h3>
        <div>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            placeholder="Ajoutez une ville"
            className="city-input-container"
          />
        </div>
        
        <div className="suggestions-dropdown">
          {citySuggestions.map((city, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleAddCity(city)}
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
      )}
      <button className="save-button" onClick={handleSave}>Sauvegarder</button>
    </div>
  );
};

export default Settings;
