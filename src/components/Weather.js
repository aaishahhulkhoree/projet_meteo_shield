import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // État de chargement

  const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`; // Inclure la langue fr pour les descriptions en français

  const handleSearch = async () => {
    if (!city) {
      setError("Veuillez entrer un nom de ville.");
      setWeatherData(null); // Réinitialiser les données météo en cas d'erreur
      return;
    }

    setLoading(true); // Démarrer le chargement

    try {
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
      setError(''); // Réinitialiser l'erreur si la requête réussit
    } catch (error) {
      setError("Erreur lors de la récupération des données météo.");
      setWeatherData(null); // Réinitialiser les données météo en cas d'erreur
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <div className="body">
      <div className="weather-container">
        <input
          type="text"
          placeholder="Entrez une ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <button onClick={handleSearch}>Rechercher</button>

        {loading && <div className="loading">Chargement...</div>} {/* Afficher un message de chargement */}

        {error && <div className="error">{error}</div>} {/* Afficher un message d'erreur */}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <p>{weatherData.weather[0].description}</p>
            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
