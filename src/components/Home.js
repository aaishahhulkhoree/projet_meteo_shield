import React, { useState, useEffect } from 'react';
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';
import PrevisionMeteo from '../utils/PrevisionMeteo';

const Home = () => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }

    try {
      await PrevisionMeteo.mettreAJourPrevisions(city);
    } catch (error) {
      console.error('Error updating weather data:', error);
      alert('Unable to fetch weather data for the entered city.');
    }
  };

  useEffect(() => {
    const fetchWeatherForUser = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const cityName = await PrevisionMeteo.getCityName(latitude, longitude);
              setCity(cityName);
              await PrevisionMeteo.mettreAJourPrevisions(cityName);
            } catch (error) {
              console.error('Error fetching user location weather:', error);
              setError('Unable to fetch weather data for your location.');
            }
          },
          (geoError) => {
            console.error('Geolocation error:', geoError);
            setError("Unable to get your location. Please enable location access.");
          }
        );
      } else {
        console.error('Geolocation is not supported in this browser.');
        setError('Geolocation is not supported in this browser.');
      }
    };

    fetchWeatherForUser();
  }, []);

  useEffect(() => {
    const observer = {
      mettreAJour: (data) => {
        if (data) {
          const today = data.list[0];
          setTemperature(`${today.main.temp}°C`);
          setWeather(today.weather[0].description);
        }
      },
    };

    PrevisionMeteo.ajouterObserver(observer);

    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter a city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Rechercher
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <Weather city={city} temperature={temperature} weather={weather} />
    </div>
  );
};

export default Home;
