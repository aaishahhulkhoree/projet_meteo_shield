import React, { useState } from 'react';
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';

const Home = () => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');

  const handleSearch = async () => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }
  
    const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
  
      // Extraire les données météo
      setTemperature(`${data.main.temp}°C`);
      setWeather(data.weather[0].description);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Unable to fetch weather data. Please check the city name or try again later.');
    }
  };
  

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />
    
      {/* Weather Component */}
      <Weather />

    </div>
  );
};

export default Home;
