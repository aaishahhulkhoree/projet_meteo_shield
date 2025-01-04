import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/styles/weather.css';
import StormAlert from './StormAlert';
import TemperatureAlert from './TemperatureAlert';
import PrecipitationAlert from './PrecipitationAlert';
import DroughtAlert from './DroughtAlert';
import TsunamiAlert from './TsunamiAlert';
import EarthquakeAlert from './EarthquakeAlert';

const Weather = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);

  // Récupérer l'unité de température de localStorage
  const temperatureUnit = localStorage.getItem('temperatureUnit') || 'C';

  const translateDescription = (description) => {
    const translations = {
      'clear sky': 'Ciel dégagé',
      'few clouds': 'Quelques nuages',
      'scattered clouds': 'Nuages épars',
      'broken clouds': 'Nuages fragmentés',
      'shower rain': 'Averses',
      'rain': 'Pluie',
      'thunderstorm': 'Orage',
      'snow': 'Neige',
      'mist': 'Brume',
    };
    return translations[description] || description;
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=fd441e159a57c88c956ebf246cc1ae9c`
        );
        const data = await response.json();
        setForecast(data);
        if (data.cod !== 200) {
          setError('Ville non trouvée ou données météo indisponibles.');
          setForecast(null);
        } else {
          setError('');
          setForecast(data);

          // Simuler des données d'alertes
          setEarthquakeData({ magnitude: 5, location: 'Tokyo' });
          setTsunamiWarning(true);
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération des données météo.');
      }
    };

    fetchWeatherData();
  }, [city]);

  if (!forecast) {
    return <p>{error || 'Chargement des données météo...'}</p>;
  }

  // Utilisation de l'icône météo
  const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

  const windIconStyle = {
    fontSize: `${Math.min(forecast.wind.speed * 4, 40)}px`, 
    color: '#9dc3fc', 
  };

  // Température depuis l'API (en Celsius)
  let temperature = forecast.main.temp;

  // Conversion en Fahrenheit si l'unité est 'F'
  if (temperatureUnit === 'F') {
    temperature = (temperature * 9/5) + 32;
  }

  return (
    <div className="weather-container">
      <h2>Météo pour {city}</h2>
      <p>Température : {Math.round(temperature)}°{temperatureUnit}</p>
      <div>
        {/* Affichage de l'icône météo */}
        <img src={weatherIcon} alt="Météo" className='icon-weather'/>
      </div>

      <div>
        <p>Description : {translateDescription(forecast.weather[0].description)}</p>
      </div>
      
      <div>
        {/* Affichage de l'icône du vent */}
        <p><i className="fas fa-wind" style={windIconStyle}></i> 
        &nbsp; {Math.round(forecast.wind.speed)} m/s</p>
      </div>
      {/* Section des alertes */}
      <StormAlert windSpeed={forecast.wind.speed} />
      <TemperatureAlert temp={temperature} /> {/* Température convertie si nécessaire */}
      <PrecipitationAlert rain={forecast.rain || 0} />
      <DroughtAlert rain={forecast.rain || 0} />
      <TsunamiAlert tsunamiWarning={tsunamiWarning} />
      <EarthquakeAlert earthquakeData={earthquakeData} />
    </div>
  );
};

Weather.propTypes = {
  city: PropTypes.string.isRequired,
};

export default Weather;
