// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';  
import CountryNames from '../utils/CountryNames'; 
import Flag from 'react-world-flags';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import '../assets/styles/searchbar.css';


const SearchBar = ({ onSearch }) => {
  const [searchCity, setSearchCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c'; // Remplacez par votre clé API

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

  return (
    <div className="search-container">
      <FaSearch className="search-icon" /> {/* Icon de recherche */}
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Enter a city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
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
                    setSuggestions([]);  // Effacer les suggestions après un clic
                    onSearch(cityDetails); // Appeler la fonction de recherche pour mettre à jour la météo
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
  );
};

// Ajout de la validation des props
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
