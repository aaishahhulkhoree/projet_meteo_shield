import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/styles/weather.css';
import StormAlert from './StormAlert';
import TemperatureAlert from './TemperatureAlert';
import PrecipitationAlert from './PrecipitationAlert';
import DroughtAlert from './DroughtAlert';
import TsunamiAlert from './TsunamiAlert';
import EarthquakeAlert from './EarthquakeAlert';
import WindSpeedInfo from './WindSpeedInfo';
import PressureInfo from './PressureInfo';
import HumidityInfo from './HumidityInfo';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Weather = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);


  // Simulation de données pour tester l'alerte sécheresse
  const testData = {
    main: {
      temp: 35,  // Température élevée
      humidity: 25, // Faible humidité
    },
    weather: [{ description: 'clear sky', icon: '01d' }],
    wind: { speed: 5 },
    rain: { '1h': 0 }, // Aucune précipitation
  };

  //Simulation de données pour tester l'alerte precipitation
  const rain ={
    '1h': 110,
  }
  
  //Simulation de données pour tester l'alerte tempete/storm
  const windSpeed = 75; // Mets cette valeur pour tester différentes alertes
  const forecastWindSpeed = 60; // Mets cette valeur pour tester les prévisions

  const [temperatureUnit, setTemperatureUnit] = useState('C'); // Valeur par défaut

  const translatedetail = (detail) => {
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
    return translations[detail] || detail;
  };

  // Récupérer l'unité de température depuis la base de données si connecté
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/preferences-utilisateur/${userId}`);
          const data = await response.json();
          if (data && data.temperature_unit) {
            setTemperatureUnit(data.temperature_unit);
          }


        } catch (error) {
          console.error('Erreur lors de la récupération des préférences utilisateur :', error);
        }
      } else {
        const localUnit = localStorage.getItem('temperatureUnit');
        setTemperatureUnit(localUnit || 'C');
      }
    };

    fetchUserPreferences();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return;

      try {
        const units = temperatureUnit === 'C' ? 'metric' : 'imperial';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=fr&appid=fd441e159a57c88c956ebf246cc1ae9c`
        );
        const data = await response.json();
        if (data.cod !== 200) {
          setError('Ville non trouvée ou données météo indisponibles.');
          setForecast(null);
        } else {
          setError('');
          setForecast(data);

          // Simuler des données d'alertes
          //setEarthquakeData({ magnitude: 8.2, depth: 10, location: 'Tokyo' });
          setTsunamiWarning(true);

          
          // Simuler une alerte tsunami pour le test
        /*setTsunamiWarning({
          detected: true,
          location: 'Océan Pacifique',
          severity: 'Haute',
          alertTime: new Date().toISOString(),
        });*/
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération des données météo.');
      }
    };

    fetchWeatherData();
  }, [city, temperatureUnit]);

  if (!forecast) {
    return (
      <>
        {error ? <p>{error}</p> : <h4>Chargement des données météo...</h4>}
      </>
    );
  }

  const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;


  let temperature = forecast.main.temp;

  return (
    <div className="weather-container">
      <h2>Météo pour {city}</h2>
      <div className='temperature'>
        <p > 🌡️ Température : {Math.round(temperature)}°{temperatureUnit}</p>
      </div>
      <p> <img src={weatherIcon} alt="Météo" className='icon-weather' /> </p>
      
      <div className='detail'>
        <p > 🔍 Détail : {translatedetail(forecast.weather[0]?.description)}</p>
      </div>

      <PressureInfo pressure={forecast.main.pressure} />
      <HumidityInfo humidity={forecast.main.humidity}/>
      <WindSpeedInfo windSpeed={forecast.wind.speed}/>
      <StormAlert windSpeed={forecast.wind.speed} />
      <TemperatureAlert temp={temperature} />
      <PrecipitationAlert rain={forecast.rain} />
      <DroughtAlert rain={forecast.rain || { '1h': 0 }} humidity={forecast.main.humidity} temp={forecast.main.temp} />
      <TsunamiAlert tsunamiWarning={tsunamiWarning} />
      <EarthquakeAlert earthquakeData={earthquakeData} />
    </div>
  );
};

Weather.propTypes = {
  city: PropTypes.string.isRequired,
};

export default Weather;
