import React, { useState, useEffect } from 'react'; 
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';  
import PrevisionMeteo from '../utils/PrevisionMeteo';
import { FaSearch } from 'react-icons/fa';  
import CountryNames from '../utils/CountryNames'; 
import Flag from 'react-world-flags'; 

const Home = () => {
  const [searchCity, setSearchCity] = useState('');
  const [displayedCity, setDisplayedCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c'; 

  const handleSearch = async (city) => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }

    try {
      setDisplayedCity(city);
      await PrevisionMeteo.mettreAJourPrevisions(city);
    } catch (error) {
      console.error('Error updating weather data:', error);
      alert('Unable to fetch weather data for the entered city.');
    }
  };

  /*const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchCity);
    }
  };*/

  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`);
      const data = await response.json();
      if (data && data.list) {
        const uniqueSuggestions = Array.from(new Set(data.list.map(item => item.name)))
          .map(name => data.list.find(item => item.name === name));

        setSuggestions(uniqueSuggestions);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  useEffect(() => {
    if (searchCity) {
      fetchCitySuggestions(searchCity);
    } else {
      setSuggestions([]);
    }
  }, [searchCity]);

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
      <Navbar /> {/* Utilisation du composant Navbar */}
      <div className="search-container">
        <FaSearch className="search-icon" onClick={() => handleSearch(searchCity)} /> {/* Utilisation de FaSearch */}
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Enter a city name"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            //onKeyDown={handleKeyDown}
            className="search-input"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            <ul>
              {suggestions.map((suggestion, index) => {
                const cityDetails = `${suggestion.name}, ${CountryNames[suggestion.sys.country] || suggestion.sys.country}`;
                const countryCode = suggestion.sys.country.toLowerCase();

                return (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchCity(cityDetails);
                      setDisplayedCity(cityDetails);
                      setSuggestions([]);  // Effacer les suggestions après un clic
                      handleSearch(cityDetails); // Met à jour directement avec la météo de la suggestion
                    }}
                    className="suggestion-item"
                  >
                    <Flag code={countryCode} style={{ width: 24, height: 16, marginRight: 8 }} />
                    <span className="city-name">{cityDetails}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      <Weather city={displayedCity} temperature={temperature} weather={weather} />
    </div>
  );
};

export default Home;
