import React, { useEffect, useState } from 'react';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import '../assets/styles/forecast.css'; // Ajoutez des styles si nécessaire

const ForecastObserver = () => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const observer = {
      mettreAJour: (data) => {
        if (data) {
          setForecast(data);
          setCity(data.city.name); // Met à jour le nom de la ville
        }
      },
    };

    PrevisionMeteo.ajouterObserver(observer);

    const fetchLocationAndForecast = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const cityName = await PrevisionMeteo.getCityName(latitude, longitude);
              setCity(cityName);
              await PrevisionMeteo.mettreAJourPrevisions(cityName);
            },
            (geoError) => {
              console.error('Erreur de géolocalisation :', geoError);
              setError("Impossible d'obtenir votre localisation.");
            }
          );
        } else {
          console.error('La géolocalisation n’est pas disponible.');
          setError("La géolocalisation n'est pas disponible sur ce navigateur.");
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des prévisions :', err);
        setError('Erreur lors du chargement des prévisions météo.');
      }
    };

    fetchLocationAndForecast();

    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, []);

  if (error) {
    return <div className="forecast-container">{error}</div>;
  }

  if (!forecast) {
    return <div className="forecast-container">Chargement des prévisions...</div>;
  }

  return (
    <div className="forecast-container">
      <h1>Prévisions météo pour {city || 'votre ville'}</h1>
      <h2>Prévisions sur 7 jours</h2>
      <div className="daily-forecast">
        {forecast.list
          .filter((item) => item.dt_txt.includes('12:00:00')) // Affiche les données de 12h chaque jour
          .map((item, index) => (
            <div key={index} className="forecast-card">
              <h4>{new Date(item.dt_txt).toLocaleDateString()}</h4>
              <p>Temp. min : {item.main.temp_min}°C</p>
              <p>Temp. max : {item.main.temp_max}°C</p>
              <p>{item.weather[0].description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ForecastObserver;
