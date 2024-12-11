import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StormAlert from './StormAlert';
import TemperatureAlert from './TemperatureAlert';
import PrecipitationAlert from './PrecipitationAlert';
import DroughtAlert from './DroughtAlert';
import TsunamiAlert from './TsunamiAlert'; 
import EarthquakeAlert from './EarthquakeAlert'; 
import WindSpeedInfo from './WindSpeedInfo';

const WeatherAlerts = ({ userPreferences }) => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // État de chargement

  const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`;

  // Fonction de recherche des données météo
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

  // Chargement des alertes pour Tsunami et Tremblement de Terre (exemples)
  useEffect(() => {
    const fetchTsunamiData = async () => { 
      setTsunamiWarning(true); // Exemple d'alerte de tsunami
    };
    const fetchEarthquakeData = async () => { 
      setEarthquakeData({ magnitude: 5 }); // Exemple de tremblement de terre
    };

    fetchTsunamiData();
    fetchEarthquakeData();
  }, []);

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

        {loading && <div className="loading">Chargement...</div>}
        {error && <div className="error">{error}</div>}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <p>{weatherData.weather[0].description}</p>
            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />

            {/* Affichage des alertes selon les conditions */}
            <StormAlert windSpeed={weatherData.wind.speed} userPreferences={userPreferences} />
            <TemperatureAlert temp={weatherData.main.temp} userPreferences={userPreferences} />
            <PrecipitationAlert rain={weatherData.rain} userPreferences={userPreferences} />
            <DroughtAlert rain={weatherData.rain} userPreferences={userPreferences} />

            {/* Affichage des alertes supplémentaires */}
            <TsunamiAlert tsunamiWarning={tsunamiWarning} userPreferences={userPreferences} />
            <EarthquakeAlert earthquakeData={earthquakeData} userPreferences={userPreferences} />
            
            {/* Affichage de la vitesse du vent */}
            <WindSpeedInfo windSpeed={weatherData.wind.speed} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAlerts;
