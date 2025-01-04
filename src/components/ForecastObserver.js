import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import SearchBar from './SearchBar'; // Import du composant SearchBar
import '../assets/styles/forecast.css'; // Le fichier CSS pour styliser le composant

const ForecastObserver = () => {
  const navigate = useNavigate();
  const [forecast, setForecast] = useState(null); // Stocke les prévisions météo
  const [error, setError] = useState(''); // Stocke les messages d'erreur
  const [city, setCity] = useState(''); // Stocke le nom de la ville
  const [hourlyForecast, setHourlyForecast] = useState(null); // Stocke les prévisions horaires pour une journée
  const [selectedDate, setSelectedDate] = useState(''); // Stocke la date sélectionnée

  // Fonction pour retourner à la page d'accueil
  const goHome = () => {
    navigate('/');
  };

  // Fonction pour initialiser les prévisions météo et la géolocalisation
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
            (error) => {
              setError('La géolocalisation n\'est pas activée.');
            }
          );
        } else {
          setError('La géolocalisation n\'est pas disponible.');
        }
      } catch (err) {
        setError('Erreur lors du chargement des prévisions météo.');
      }
    };

    fetchLocationAndForecast();

    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, []); // Ajout de `[]` comme dépendance pour exécuter l'effet une seule fois au montage

  // Gérer l'erreur ou le chargement
  if (error) {
    return (
      <div className="forecast-container">
        <button className="home-btn" onClick={goHome}>
          <span>Retour à l&apos;accueil</span>
        </button>

        {/* Inclure la barre de recherche après le bouton accueil */}
        <SearchBar onSearch={async (city) => {
          try {
            setCity(city);
            await PrevisionMeteo.mettreAJourPrevisions(city);
            setError(''); // Effacer le message d'erreur si la recherche réussit
          } catch (searchError) {
            setError('Impossible de récupérer les prévisions pour cette ville.');
          }
        }} />

        <p>{error}</p>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="forecast-container">
        <button className="home-btn" onClick={goHome}>
          <span>Retour à l&apos;accueil</span>
        </button>

        {/* Inclure la barre de recherche après le bouton accueil */}
        <SearchBar onSearch={async (city) => {
          try {
            setCity(city);
            await PrevisionMeteo.mettreAJourPrevisions(city);
            setError(''); // Effacer le message d'erreur si la recherche réussit
          } catch (searchError) {
            setError('Impossible de récupérer les prévisions pour cette ville.');
          }
        }} />

        <p>Chargement des prévisions...</p>
      </div>
    );
  }

  // Grouper les données par jour
  const groupedData = forecast.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dailyForecasts = Object.entries(groupedData).slice(0,6).map(([date, data]) => ({
    date,
    min: Math.round(Math.min(...data.map((item) => item.main.temp_min))),
    max: Math.round(Math.max(...data.map((item) => item.main.temp_max))),
    description: data[0].weather[0].description,
    hourly: data,
  }));

  // Fonction pour gérer le clic sur une journée
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setHourlyForecast(groupedData[date]);
  };

  // Fonction de recherche de ville
  const handleSearch = async (city) => {
    if (!city) {
      alert('Veuillez entrer un nom de ville');
      return;
    }

    try {
      setCity(city);
      await PrevisionMeteo.mettreAJourPrevisions(city);
    } catch (error) {
      setError('Impossible de récupérer les prévisions pour cette ville.');
    }
  };

  return (
    <div className="forecast-container">
      {/* Barre de recherche et bouton retour à l'accueil alignés */}
      <div className="search-home-container">
        <button className="home-btn" onClick={goHome}>
          <span>Retour à l&apos;accueil</span>
        </button>

        {/* Inclure la barre de recherche après le bouton retour */}
        <SearchBar onSearch={handleSearch} />

        <h1>Prévisions météo pour {city || 'votre ville'}</h1>
        <h2>Prévisions sur 5 jours</h2>
      </div>

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
                  <p>Température : {Math.round(item.main.temp)}°C</p>
                  <p>Précipitations : {precipitation > 0 ? `${precipitation}%` : '-'}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                    className="forecast-icon"
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
