// src/pages/Home.js
import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';  
import PrevisionMeteo from '../utils/PrevisionMeteo';
import SearchBar from '../components/SearchBar'; // Importer SearchBar

const Home = () => {
  const [displayedCity, setDisplayedCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  //const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleSearch = async (city) => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }

    try {
      setDisplayedCity(city);
      await PrevisionMeteo.mettreAJourPrevisions(city);

      // Naviguer vers la route /:city
      navigate(`/${city}`);
    } catch (error) {
      console.error('Error updating weather data:', error);
      alert('Unable to fetch weather data for the entered city.');
    }
  };

  useEffect(() => {
    const observer = {
      mettreAJour: (data) => {
        if (data) {
          const today = data.list[0];
          setTemperature(`${today.main.temp}°C`);
          setWeather(today.weather[0].description);
          setHumidity(`${today.main.humidity}%`);
          setPressure(`${today.main.pressure} hPa`);
          setWindSpeed(`${today.wind.speed} m/s`);
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
      <SearchBar onSearch={handleSearch} /> {/* Utilisation du composant SearchBar */}
      {error && <p className="error-message">{error}</p>}
      <Weather 
        city={displayedCity} 
        temperature={temperature} 
        weather={weather} 
        humidity={humidity} 
        pressure={pressure} 
        windSpeed={windSpeed} 
      />
    </div>
  );
};

export default Home;
