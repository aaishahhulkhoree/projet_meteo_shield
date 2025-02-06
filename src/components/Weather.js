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
  const [forecast, setForecast] = useState(null); // Prévisions météo
  const [error, setError] = useState(''); // Message d'erreur
  const [earthquakeData, setEarthquakeData] = useState(null); // Données des alertes séismes
  const [tsunamiWarning, setTsunamiWarning] = useState(false); // Alerte tsunami

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
  const rain = {
    '1h': 110,
  }

  //Simulation de données pour tester l'alerte tempete/storm
  const windSpeed = 75; // Mets cette valeur pour tester différentes alertes
  const forecastWindSpeed = 60; // Mets cette valeur pour tester les prévisions

  const [temperatureUnit, setTemperatureUnit] = useState('C'); // Unité de température par défaut (Celsius)

  // Fonction pour traduire les descriptions de la météo (de l'anglais vers le français)
  // Entrée: detail (chaîne de caractères représentant la description de la météo)
  // Sortie: traduction de la description (chaîne de caractères)
  // Description: Cette fonction permet de traduire les descriptions météorologiques de l'API OpenWeatherMap en français
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
    return translations[detail] || detail; // Retourne la traduction si trouvée, sinon la description originale
  };

  // Effet pour récupérer les préférences de l'utilisateur (unité de température)
  // Entrée: Aucune (les préférences sont récupérées via l'ID utilisateur dans le stockage local)
  // Sortie: Modifie l'état temperatureUnit avec l'unité de température de l'utilisateur
  // Description: Cette fonction permet de récupérer l'unité de température préférée de l'utilisateur depuis une API ou le stockage local
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/preferences-utilisateur/${userId}`);
          const data = await response.json();
          if (data && data.temperature_unit) {
            setTemperatureUnit(data.temperature_unit); // Met à jour l'unité de température en fonction des préférences de l'utilisateur
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des préférences utilisateur :', error);
        }
      } else {
        const localUnit = localStorage.getItem('temperatureUnit');
        setTemperatureUnit(localUnit || 'C'); // Si l'utilisateur n'est pas connecté, utilise les préférences locales
      }
    };

    fetchUserPreferences();
  }, []); // Le hook ne se lance qu'une seule fois à l'initialisation du composant

  // Effet pour récupérer les données météo de l'API OpenWeatherMap
  // Entrée: city (nom de la ville dont on veut obtenir les prévisions)
  // Sortie: Met à jour l'état 'forecast' avec les données météo ou affiche une erreur
  // Description: Cette fonction effectue une requête à l'API OpenWeatherMap pour récupérer les données météo en fonction de la ville
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return; // Si aucune ville n'est fournie, on ne fait pas de requête

      try {
        const units = temperatureUnit === 'C' ? 'metric' : 'imperial'; // Choisit les unités en fonction de l'unité de température
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=fr&appid=fd441e159a57c88c956ebf246cc1ae9c`
        );
        const data = await response.json();
        if (data.cod !== 200) {
          setError('Ville non trouvée ou données météo indisponibles.'); // En cas d'erreur dans les données retournées
          setForecast(null);
        } else {
          setError('');
          setForecast(data); // Met à jour l'état avec les données météo récupérées
          // Simuler des alertes (séisme, tsunami, etc.)
          setTsunamiWarning(true); // Simule une alerte tsunami pour le test
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération des données météo.'); // Erreur lors de la requête
      }
    };

    fetchWeatherData();
  }, [city, temperatureUnit]); // Ce hook se déclenche lorsque la ville ou l'unité de température change

  // Si aucune donnée météo n'est disponible, affiche un message d'erreur ou de chargement
  if (!forecast) {
    return (
      <>
        {error ? <p>{error}</p> : <h4>Chargement des données météo...</h4>}
      </>
    );
  }

  // Récupère l'icône météo depuis l'API
  const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

  // Récupère la température actuelle
  let temperature = forecast.main.temp;

  return (
    <div className="weather-container">
      <h2>Météo pour {city}</h2>
      <div className='temperature'>
        <p>🌡️ Température : {Math.round(temperature)}°{temperatureUnit}</p>
      </div>

      <div className='detail'>
        <p>🔍 Détail : {translatedetail(forecast.weather[0]?.description)}</p>
        <p><img src={weatherIcon} alt="Météo" className='icon-weather' /></p>
      </div>

      {/* Informations sur la pression, humidité, vitesse du vent, etc. */}
      <PressureInfo pressure={forecast.main.pressure} />
      <HumidityInfo humidity={forecast.main.humidity} />
      <WindSpeedInfo windSpeed={forecast.wind.speed} />
      <StormAlert windSpeed={forecast.wind.speed} />
      <TemperatureAlert temp={temperature} />
      <PrecipitationAlert rain={forecast.rain} />
      <DroughtAlert rain={forecast.rain || { '1h': 0 }} humidity={forecast.main.humidity} temp={forecast.main.temp} />
      <TsunamiAlert tsunamiWarning={tsunamiWarning} />
      <EarthquakeAlert earthquakeData={earthquakeData} />
    </div>
  );
};

// Validation des props du composant
Weather.propTypes = {
  city: PropTypes.string.isRequired, // La ville est une prop obligatoire
};

export default Weather;
