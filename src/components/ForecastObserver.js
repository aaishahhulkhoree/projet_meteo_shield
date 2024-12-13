import React, { useEffect, useState } from 'react';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import '../assets/styles/forecast.css';

const ForecastObserver = () => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const observer = {
      mettreAJour: (data) => {
        if (data) {
          setForecast(data);
          setCity(data.city.name);
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

  const groupedData = forecast.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = { min: item.main.temp_min, max: item.main.temp_max, weather: item.weather[0].description };
    } else {
      acc[date].min = Math.min(acc[date].min, item.main.temp_min);
      acc[date].max = Math.max(acc[date].max, item.main.temp_max);
    }
    return acc;
  }, {});

  const dailyForecasts = Object.entries(groupedData).map(([date, data]) => ({
    date,
    min: data.min,
    max: data.max,
    description: data.weather,
  }));

  return (
    <div className="forecast-container">
      <h1>Prévisions météo pour {city || 'votre ville'}</h1>
      <h2>Prévisions sur 7 jours</h2>
      <div className="daily-forecast">
        {dailyForecasts.map((item, index) => (
          <div key={index} className="forecast-card">
            <h4>{new Date(item.date).toLocaleDateString()}</h4>
            <p>Temp. min : {item.min}°C</p>
            <p>Temp. max : {item.max}°C</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastObserver;
