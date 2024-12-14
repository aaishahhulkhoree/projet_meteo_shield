import React, { useEffect, useState } from 'react';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import '../assets/styles/forecast.css';

const ForecastObserver = () => {
  const [forecast, setForecast] = useState(null); // Stocke les prévisions météo
  const [error, setError] = useState(''); // Stocke les messages d'erreur
  const [city, setCity] = useState(''); // Stocke le nom de la ville
  const [hourlyForecast, setHourlyForecast] = useState(null); // Stocke les prévisions horaires pour une journée
  const [selectedDate, setSelectedDate] = useState(''); // Stocke la date sélectionnée

  // Fonction pour initialiser les prévisions météo et géolocalisation
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
            (geoError) => setError("Impossible d'obtenir votre localisation.")
          );
        } else {
          setError("La géolocalisation n'est pas disponible sur ce navigateur.");
        }
      } catch (err) {
        setError('Erreur lors du chargement des prévisions météo.');
      }
    };

    fetchLocationAndForecast();

    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, []);

  // Gérer l'erreur ou le chargement
  if (error) {
    return <div className="forecast-container">{error}</div>;
  }
  if (!forecast) {
    return <div className="forecast-container">Chargement des prévisions...</div>;
  }

  // Grouper les données par jour
  const groupedData = forecast.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dailyForecasts = Object.entries(groupedData).map(([date, data]) => ({
    date,
    min: Math.min(...data.map((item) => item.main.temp_min)),
    max: Math.max(...data.map((item) => item.main.temp_max)),
    description: data[0].weather[0].description,
    hourly: data,
  }));

  // Fonction pour gérer le clic sur une journée
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setHourlyForecast(groupedData[date]);
  };

  return (
    <div className="forecast-container">
      <h1>Prévisions météo pour {city || 'votre ville'}</h1>
      <h2>Prévisions sur 7 jours</h2>
      <div className="daily-forecast">
        {dailyForecasts.map((item, index) => (
          <div
            key={index}
            className="forecast-card"
            onClick={() => handleDayClick(item.date)}
          >
            <h4>{new Date(item.date).toLocaleDateString()}</h4>
            <img
              src={`https://openweathermap.org/img/wn/${item.hourly[0].weather[0].icon}@2x.png`}
              alt={item.hourly[0].weather[0].description}
              className="forecast-icon"
            />
            <p>Temp. min : {item.min}°C</p>
            <p>Temp. max : {item.max}°C</p>
          </div>
        ))}
      </div>

      {hourlyForecast && (
        <div className="hourly-forecast">
          <h2>Prévisions horaires pour {selectedDate}</h2>
          <div className="hourly-list">
            {hourlyForecast.map((item, index) => {
              const time = new Date(item.dt_txt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const precipitation =
                item.rain?.['3h'] || item.snow?.['3h'] || 0;
              return (
                <div key={index} className="hourly-card">
                  <p>{time}</p>
                  <p>Température : {item.main.temp}°C</p>
                  <p>Précipitations : {precipitation > 0 ? `${precipitation}%` : '-'}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastObserver;
