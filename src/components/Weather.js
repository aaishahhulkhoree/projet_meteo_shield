import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const handleSearch = async () => {
    if (!city) {
      setError("Veuillez entrer un nom de ville.");
      return;
    }

    try {
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
      setError('');
    } catch (error) {
      setError("Erreur lors de la récupération des données météo.");
      setWeatherData(null);
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

        {error && <div className="error">{error}</div>}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <p>{weatherData.weather[0].description}</p>
            <p className='temperature'>{weatherData.main.temp}°C</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
