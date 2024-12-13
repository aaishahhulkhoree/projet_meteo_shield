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

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

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
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const cityName = await PrevisionMeteo.getCityName(latitude, longitude);
            setCity(cityName);

            // Mettre à jour les prévisions pour la ville
            await PrevisionMeteo.mettreAJourPrevisions(cityName);

            // Charger les alertes
            // Exemple de données fictives pour les alertes
            setEarthquakeData({ magnitude: 5, location: 'Tokyo' });
            setTsunamiWarning(true);
          }, (geoError) => {
            console.error('Erreur de géolocalisation :', geoError);
            setError('Impossible de récupérer la position actuelle.');
          });
        } else {
          console.error('La géolocalisation n’est pas prise en charge.');
          setError('La géolocalisation n’est pas disponible sur ce navigateur.');
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
  }, []);

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
      <p>Météo : {today.weather[0].description}</p>

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
