// src/components/SearchBar.js
// Importation de React et des hooks nécessaires pour la gestion d'état
import React, { useState, useEffect } from 'react';
// Importation de PropTypes pour la validation des props
import PropTypes from 'prop-types';
// Importation de l'icône de recherche
import { FaSearch } from 'react-icons/fa';
// Importation des noms des pays pour affichage
import CountryNames from '../utils/CountryNames';
// Importation du composant pour afficher le drapeau des pays
import Flag from 'react-world-flags';
// Importation des prévisions météo depuis un fichier utilitaire
import PrevisionMeteo from '../utils/PrevisionMeteo';
// Importation des styles pour la barre de recherche
import '../assets/styles/searchbar.css';

/**
 * Composant `SearchBar` permettant de rechercher une ville et d'afficher des suggestions de villes.
 * Lorsqu'une suggestion est sélectionnée, elle déclenche une recherche de la météo pour cette ville.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onSearch - Fonction à appeler lors de la sélection d'une ville pour récupérer la météo.
 * 
 * @returns {JSX.Element} Le composant contenant le champ de recherche et les suggestions de villes.
 */
const SearchBar = ({ onSearch }) => {
  // Déclaration de l'état pour gérer la ville recherchée et les suggestions
  const [searchCity, setSearchCity] = useState(''); 
  const [suggestions, setSuggestions] = useState([]); 

  // Clé API pour interroger OpenWeatherMap (remplacer par une clé personnelle pour un projet réel)
  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c'; 

  /**
   * Fonction qui effectue une requête API pour obtenir des suggestions de villes basées sur la saisie de l'utilisateur.
   * Filtre les doublons et exclut certains types de villes comme les arrondissements.
   * 
   * @param {string} query - La chaîne de texte saisie par l'utilisateur pour rechercher des villes.
   */
  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]); // Réinitialisation des suggestions si le texte est trop court
      return;
    }

    try {
      // Requête pour obtenir des villes correspondant à la recherche
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`
      );
      const data = await response.json();

      if (data && data.list) {
        // Suppression des doublons en utilisant un objet comme filtre
        const seenCities = {};
        const uniqueSuggestions = data.list.filter((item) => {
          const key = `${item.name}-${item.sys.country}`;
          if (seenCities[key]) {
            return false;
          }
          seenCities[key] = true;
          return true;
        });

        // Filtrer les arrondissements et les villes commençant par "arrondissement de"
        const filteredSuggestions = uniqueSuggestions.filter((suggestion) => {
          const cityName = suggestion.name.toLowerCase();

          // Vérifier si le nom de la ville correspond à un arrondissement
          const isArrondissement = /\d{1,2}(er|e)?$/.test(cityName);
          const isArrondissementOf = cityName.startsWith('arrondissement de');

          // Exclure ces villes
          return !isArrondissement && !isArrondissementOf;
        });

        // Mise à jour des suggestions filtrées dans l'état
        setSuggestions(filteredSuggestions);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  // Effet déclenché à chaque modification du champ de recherche
  useEffect(() => {
    if (searchCity) {
      fetchCitySuggestions(searchCity); // Appel pour récupérer les suggestions
    } else {
      setSuggestions([]); // Réinitialisation des suggestions lorsque le champ est vide
    }
  }, [searchCity]); // Dépendance sur `searchCity` pour réagir à sa mise à jour

  return (
    <div className="search-container">
      {/* Icône de recherche */}
      <FaSearch className="search-icon" />
      <div className="search-input-wrapper">
        {/* Champ de saisie pour la recherche de ville */}
        <input
          type="text"
          placeholder="Enter a city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)} // Mise à jour de l'état à chaque saisie
          className="search-input"
        />
      </div>

      {/* Affichage des suggestions si elles existent */}
      {suggestions.length > 0 && (
        <div className="suggestions-container">
          <ul>
            {suggestions.map((suggestion, index) => {
              // Combinaison du nom de la ville et du pays
              const cityDetails = `${suggestion.name}, ${CountryNames[suggestion.sys.country] || suggestion.sys.country}`;
              const countryCode = suggestion.sys.country.toLowerCase();

              return (
                <li
                  key={index}
                  onClick={() => {
                    setSuggestions([]); // Effacer les suggestions après un clic
                    onSearch(cityDetails); // Appeler la fonction de recherche pour mettre à jour la météo
                  }}
                  className="suggestion-item"
                >
                  {/* Affichage du drapeau du pays */}
                  <Flag code={countryCode} style={{ width: 24, height: 16, marginRight: 8 }} />
                  {/* Affichage du nom de la ville et du pays */}
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

// Validation de la prop 'onSearch' pour s'assurer qu'il s'agit d'une fonction
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, 
};

// Exportation du composant pour qu'il puisse être utilisé ailleurs dans l'application
export default SearchBar;
