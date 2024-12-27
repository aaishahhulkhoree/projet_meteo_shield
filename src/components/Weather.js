import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes
import PrevisionMeteo from '../utils/PrevisionMeteo';
import StormAlert from './StormAlert';
import TemperatureAlert from './TemperatureAlert';
import PrecipitationAlert from './PrecipitationAlert';
import DroughtAlert from './DroughtAlert';
import TsunamiAlert from './TsunamiAlert';
import EarthquakeAlert from './EarthquakeAlert';
import WindSpeedInfo from './WindSpeedInfo';
import PressureInfo from './PressureInfo'; // Import de PressureInfo
import HumidityInfo from './HumidityInfo'; // Import de HumidityInfo
import '../assets/styles/weather.css';

const Weather = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);
  const [error, setError] = useState('');
  const [validCity, setValidCity] = useState(true); // Pour savoir si la ville est valide ou non

  useEffect(() => {
    // Observer pour les prévisions
    const observer = {
      mettreAJour: (data) => {
        if (data) {
          setForecast(data);
        }
      },
    };

    PrevisionMeteo.ajouterObserver(observer);

    const fetchWeatherAndAlerts = async () => {
      try {
        if (city) {
          // Requête à l'API pour récupérer les données météo de la ville
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fd441e159a57c88c956ebf246cc1ae9c`);
          const data = await response.json();
          
          if (data.cod === '404') {
            setError('Ville n\'existe pas');
            setValidCity(false); // Marquer la ville comme invalide
            setForecast(null); // Réinitialiser les prévisions si la ville n'est pas valide
          } else {
            setError('');
            setValidCity(true); // Ville valide
            setForecast(data);
            // Charger les alertes fictives pour exemple
            setEarthquakeData({ magnitude: 5, location: 'Tokyo' });
            setTsunamiWarning(true);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données météo ou des alertes :', err);
        setError('Une erreur est survenue lors du chargement des données.');
      }
    };

    fetchWeatherAndAlerts();

    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, [city]); // Mettre à jour lorsqu'une nouvelle ville est recherchée

  if (!forecast) {
    return <div className="weather-container">Chargement des données météo...</div>;
  }

  const today = forecast?.list?.[0]; // Assurez-vous que `forecast.list` existe

  if (!today) {
    return (
      <div className="weather-container">
        <p>Les données météo sont actuellement indisponibles.</p>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <h2>Informations météo actuelles</h2>
      <p>Ville : {validCity ? city : error || 'Non disponible'}</p> {/* Affiche la ville ou l'erreur */}

      <img
        src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
        alt={today.weather[0].description}
        className="current-weather-icon"
      />

      {/* Alertes */}
      <StormAlert windSpeed={today.wind.speed} />
      <TemperatureAlert temp={today.main.temp} />
      <PrecipitationAlert rain={today.rain || 0} />
      <DroughtAlert rain={today.rain || 0} />
      <TsunamiAlert tsunamiWarning={tsunamiWarning} />
      <EarthquakeAlert earthquakeData={earthquakeData} />

      {/* Informations supplémentaires */}
      <WindSpeedInfo windSpeed={today.wind.speed} />
      <PressureInfo pressure={today.main.pressure} />
      <HumidityInfo humidity={today.main.humidity} />
    </div>
  );
};

// Définir les PropTypes pour valider les props du composant Weather
Weather.propTypes = {
  city: PropTypes.string.isRequired, // city doit être une chaîne de caractères et est requise
};

export default Weather;
