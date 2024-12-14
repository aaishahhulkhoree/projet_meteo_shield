import React, { useState, useEffect } from 'react';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import StormAlert from './StormAlert';
import TemperatureAlert from './TemperatureAlert';
import PrecipitationAlert from './PrecipitationAlert';
import DroughtAlert from './DroughtAlert';
import TsunamiAlert from './TsunamiAlert';
import EarthquakeAlert from './EarthquakeAlert';
import WindSpeedInfo from './WindSpeedInfo';
import '../assets/styles/weather.css';

const Weather = ({ city, temperature, weather }) => {
  const [forecast, setForecast] = useState(null);
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // S'abonner aux prévisions météo via PrevisionMeteo
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
          // Mettre à jour les prévisions pour la ville sélectionnée
          await PrevisionMeteo.mettreAJourPrevisions(city);
        }

        // Charger les alertes fictives pour exemple
        setEarthquakeData({ magnitude: 5, location: 'Tokyo' });
        setTsunamiWarning(true);
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
      <p>Ville : {city || 'Non disponible'}</p>
      <p>Température : {today.main.temp}°C</p>
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
    </div>
  );
};

export default Weather;
