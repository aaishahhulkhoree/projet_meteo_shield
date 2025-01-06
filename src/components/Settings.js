import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountryNames from '../utils/CountryNames';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState('storm');
  const [temperatureUnit, setTemperatureUnit] = useState(
    localStorage.getItem('temperatureUnit') || 'C'
  );
  const [preferredCities, setPreferredCities] = useState(() => {
    const savedCities = localStorage.getItem('preferredCities');
    return savedCities ? JSON.parse(savedCities) : [];
  });
  const [cityInput, setCityInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);

  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c';
  const navigate = useNavigate();

  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch city suggestions');
      }
      const data = await response.json();
      const formattedSuggestions = data
        .map((city) => ({
          name: city.name,
          country: CountryNames[city.country] || city.country,
        }))
        // Supprimer les doublons dans les suggestions
        .filter(
          (suggestion, index, self) =>
            index === self.findIndex((c) => c.name === suggestion.name && c.country === suggestion.country)
        )
        // Exclure les villes déjà ajoutées
        .filter((suggestion) => !preferredCities.some((c) => c.name === suggestion.name));

      setCitySuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleAlertChange = (e) => setAlertType(e.target.value);

  const handleTemperatureChange = (e) => setTemperatureUnit(e.target.value);

  const handleCityInputChange = (event) => {
    const query = event.target.value;
    setCityInput(query);
    fetchCitySuggestions(query);
  };

  const handleAddCity = (city) => {
    if (!preferredCities.some((c) => c.name === city.name)) {
      const updatedCities = [...preferredCities, city];
      setPreferredCities(updatedCities);
      localStorage.setItem('preferredCities', JSON.stringify(updatedCities));
    }
    setCityInput('');
    setCitySuggestions([]);
  };

  const handleRemoveCity = (cityName) => {
    const updatedCities = preferredCities.filter((city) => city.name !== cityName);
    setPreferredCities(updatedCities);
    localStorage.setItem('preferredCities', JSON.stringify(updatedCities));
  };

  const handleSave = () => {
    localStorage.setItem('temperatureUnit', temperatureUnit);
    alert('Préférences sauvegardées !');
    navigate('/');
  };

  const goHome = () => navigate('/');

  return (
    <div className="settings-container">
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>
      <h1>Paramètres</h1>
      <p>Personnalisez vos préférences de température, alerte météo et liste de villes préférées.</p>
      <div className="setting-option">
        <label htmlFor="temperatureUnit">Unité de température :</label>
        <select
          id="temperatureUnit"
          value={temperatureUnit}
          onChange={handleTemperatureChange}
        >
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
        </select>
      </div>
      <div className="setting-option">
        <label htmlFor="alertType">Type d&apos;alerte météo :</label>
        <select id="alertType" value={alertType} onChange={handleAlertChange}>
          <option value="storm">Tempête</option>
          <option value="heatwave">Canicule</option>
          <option value="rain">Pluie intense</option>
          <option value="earthquake">Séisme</option>
          <option value="tsunami">Tsunami</option>
        </select>
      </div>
      <div className="setting-option">
        <h3>Villes préférées :</h3>
        <div className="city-input-container">
          <input
            type="text"
            value={cityInput}
            onChange={handleCityInputChange}
            placeholder="Ajoutez une ville"
          />
          {citySuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {citySuggestions.map((city, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleAddCity({ name: city.name, country: city.country })}
                >
                  {city.name}, {city.country}
                </div>
              ))}
            </div>
          )}
        </div>
        <ul className="preferred-cities-list">
          {preferredCities.map((city, index) => (
            <div key={index} className="preferred-city-item">
              {city.name}, {city.country}{' '}
              <button onClick={() => handleRemoveCity(city.name)} className="delete-button">
                Supprimer
              </button>
            </div>
          ))}
        </ul>
      </div>
      <div className="button-container">
        <button className="save-button" onClick={handleSave}>
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default Settings;
