import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import SearchBar from './SearchBar';
import '../assets/styles/forecast.css';

const ForecastObserver = () => {
  const navigate = useNavigate();
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const goHome = () => {
    navigate('/');
  };

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
      'moderate rain': 'Pluie modérée',
      'light rain': 'Pluie légère',
      'overcast clouds': 'Nuages couverts',
      'heavy intensity rain': 'Pluie intense',
      'light snow': 'Neige légère',
    };
    return translations[detail] || detail;
  };

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
  }, []);

  if (error) {
    return (
      <div className="forecast-container">
        <button className="home-btn" onClick={goHome}>
          <span>Retour à l&apos;accueil</span>
        </button>
        <SearchBar
          onSearch={async (city) => {
            try {
              setCity(city);
              await PrevisionMeteo.mettreAJourPrevisions(city);
              setError('');
            } catch (searchError) {
              setError('Impossible de récupérer les prévisions pour cette ville.');
            }
          }}
        />
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
        <SearchBar
          onSearch={async (city) => {
            try {
              setCity(city);
              await PrevisionMeteo.mettreAJourPrevisions(city);
              setError('');
            } catch (searchError) {
              setError('Impossible de récupérer les prévisions pour cette ville.');
            }
          }}
        />
        <p>Chargement des prévisions...</p>
      </div>
    );
  }

  const groupedData = forecast.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dailyForecasts = Object.entries(groupedData).slice(0, 6).map(([date, data]) => ({
    date,
    min: Math.round(Math.min(...data.map((item) => item.main.temp_min))),
    max: Math.round(Math.max(...data.map((item) => item.main.temp_max))),
    detail: translatedetail(data[0].weather[0]?.description),
    hourly: data,
  }));

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setHourlyForecast(groupedData[date]);
  };

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
      <div className="search-home-container">
        <button className="home-btn" onClick={goHome}>
          <span>Retour à l&apos;accueil</span>
        </button>
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
              alt={item.hourly[0].weather[0].detail}
              className="forecast-icon"
            />
            <p>Détail : {item.detail}</p>
            <p>Temp. min : {item.min}°C</p>
            <p>Temp. max : {item.max}°C</p>
          </div>
        ))}
      </div>
      {hourlyForecast && (
        <div className="hourly-forecast">
          <h2>Prévisions horaires pour {selectedDate}</h2>
          <div className="hourly-list">
            {hourlyForecast.map((item, index) => (
              <div key={index} className="hourly-card">
                <p>{new Date(item.dt_txt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</p>
                <p>Température : {Math.round(item.main.temp)}°C</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].detail}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastObserver;
