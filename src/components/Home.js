import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [displayedCity, setDisplayedCity] = useState('');
  const [preferredCities] = useState(() => {
    const savedCities = localStorage.getItem('preferredCities');
    return savedCities ? JSON.parse(savedCities) : [];
  });
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const navigate = useNavigate();

  // Gestion de la recherche via la barre de recherche
  const handleSearch = async (city) => {
    if (!city) {
      alert('Veuillez entrer un nom de ville');
      return;
    }

    try {
      setDisplayedCity(city); console.log(city);
      await PrevisionMeteo.mettreAJourPrevisions(city);

      // Naviguer vers la route spécifique
      navigate(`/${city}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données météo :', error);
      alert('Impossible de récupérer les données météo pour la ville recherchée.');
    }
  };

  // Gestion de la sélection via la liste des villes préférées
  const handleCitySelect = (event) => {
    const selectedCity = event.target.value;
    setDisplayedCity(selectedCity);
    navigate(`/${selectedCity}`);
    console.log(selectedCity);
  };

  // Mettre à jour les données météo lorsque la ville change
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
          setDisplayedCity(today.name); 
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
      <SearchBar onSearch={handleSearch} />
      {preferredCities.length > 0 && (
        <div className="preferred-cities-container">
          <label htmlFor="preferred-cities-select">Sélectionnez une ville :</label>
          <select
            id="preferred-cities-select"
            onChange={handleCitySelect}
            value={displayedCity}
          >
            <option value="">--Choisissez une ville--</option>
            {preferredCities.map((city, index) => (
              <option key={index} value={city.name}>
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </div>
      )}
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
console.log(displayedCity);

export default Home;
