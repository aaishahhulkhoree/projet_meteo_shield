import React, { useState, useEffect } from 'react';
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';
import PrevisionMeteo from '../utils/PrevisionMeteo';

const Home = () => {
  const [searchCity, setSearchCity] = useState(''); // Ville recherchée
  const [displayedCity, setDisplayedCity] = useState(''); // Ville actuellement affichée
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchCity) {
      alert('Please enter a city name');
      return;
    }

    try {
      setDisplayedCity(searchCity); // Met à jour la ville affichée
      await PrevisionMeteo.mettreAJourPrevisions(searchCity);
    } catch (error) {
      console.error('Error updating weather data:', error);
      alert('Unable to fetch weather data for the entered city.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
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
              setSearchCity(cityName);
              setDisplayedCity(cityName); // Initialiser avec la ville actuelle
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
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger search on Enter
          className="search-input"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <Weather city={displayedCity} temperature={temperature} weather={weather} />
    </div>
  );
};

export default Home;
