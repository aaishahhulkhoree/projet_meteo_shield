import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import SearchBar from '../components/SearchBar';

/**
 * Composant principal représentant la page d'accueil de l'application.
 * Il permet d'afficher la météo d'une ville via une recherche ou la géolocalisation de l'utilisateur.
 */
const Home = () => {
  // États pour stocker différentes données de l'application
  const [city, setCity] = useState('');
  const [preferredCities, setPreferredCities] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [geoLocationWeather, setGeoLocationWeather] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

   /**
   * Récupère la liste des villes favorites de l'utilisateur connecté
   */
  useEffect(() => {
    const fetchPreferredCities = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setPreferredCities([]); // Si pas connecté, pas de villes favorites
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/villes-favorites/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setPreferredCities(data.villes || []);
        } else {
          console.error('Erreur lors de la récupération des villes favorites.');
          setPreferredCities([]);
        }
      } catch (error) {
        console.error('Erreur réseau lors de la récupération des villes favorites :', error);
        setPreferredCities([]);
      }
    };

    fetchPreferredCities();
  }, []);

  /**
   * Récupère les données météo via la géolocalisation de l'utilisateur
   * @param {float} lat - Latitude de l'utilisateur
   * @param {float} lon - Longitude de l'utilisateur
   */
  const fetchWeatherByGeoLocation = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=fd441e159a57c88c956ebf246cc1ae9c`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert('Impossible de récupérer les données météo.');
      } else {
        setGeoLocationWeather(data);
        checkWeatherAlerts(data);
      }
    } catch (error) {
      console.error('Erreur de récupération des données météo :', error);
      alert('Erreur de récupération des données météo.');
    }
  };

  /**
   * Vérifie si la météo actuelle nécessite une alerte.
   * @param {Object} data - Données météo récupérées
   */
  const checkWeatherAlerts = (data) => {
    const weatherCondition = data.weather[0].main;
    const cityName = data.name.split(' ')[0];
    let message = '';
  
    switch (weatherCondition) {
      case 'Thunderstorm':
        message = `Alerte : Orage violent en cours à ${cityName}.`;
        break;
      case 'Rain':
        message = `Alerte : Pluie à ${cityName}.`;
        break;
      case 'Snow':
        message = `Alerte : Chutes de neige à ${cityName}.`;
        break;
      case 'Mist':
      case 'Fog':
        message = `Alerte : Brume ou brouillard à ${cityName}.`;
        break;
      case 'Drought':
        message = `Alerte : Secheresse à ${cityName}.`;
        break;
      case 'Flood':
        message = `Alerte : Inondation à ${cityName}.`;
        break;
      case 'Tsunami':
        message = `Alerte : Tsunami à ${cityName}.`;
        break;
      default:
        message = `Aucune alerte détectée à ${cityName} !`;
    }
  
    setAlertMessage(message);
    setShowAlert(message !== `Aucune alerte détectée à ${cityName} !`);
  };
  
 
  /**
   * Ferme l'alerte affichée
   */
  const closeAlert = () => {
    setShowAlert(false);
  };

  /**
   * Utilise la géolocalisation de l'utilisateur pour récupérer la météo actuelle
   */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByGeoLocation(latitude, longitude);
      },
      (err) => {
        console.error('Erreur de géolocalisation :', err);
        alert('Impossible de récupérer votre position géographique.');
      }
    );
  }, []);

  /**
   * Gère la recherche d'une ville par l'utilisateur
   * @param {string} city - Nom de la ville recherchée
   */
  const handleSearch = async (city) => {
    if (!city) {
      alert('Veuillez entrer un nom de ville');
      return;
    }

    try {
      setCity(city);
      setAlertMessage('');
      navigate(`/${city}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données météo :', error);
      alert('Impossible de récupérer les données météo pour la ville recherchée.');
    }
  };

  /**
   * Gère la sélection d'une ville favorite par l'utilisateur
   * @param {Event} event - Événement de sélection
   */
  const handleCitySelect = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
    setAlertMessage('');
    navigate(`/${selectedCity}`);
  };

  /**
   * Met à jour les données météo lorsque la ville change
   */
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
          setCity(today.name);
          setAlertMessage('');
        }
      },
    };

    PrevisionMeteo.ajouterObserver(observer);

    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, []);

  // Vérification des alertes supplémentaires pour la géolocalisation
  useEffect(() => {
    if (geoLocationWeather) {
      const weatherCondition = geoLocationWeather.weather[0].main;
      if (
        weatherCondition === 'Thunderstorm' || //orage 
        weatherCondition === 'Rain' || // pluie 
        weatherCondition === 'Snow' || //neige
        weatherCondition === 'Mist' || //brume
        weatherCondition === 'Fog'  || //brouillard
        weatherCondition === 'Drought' || //secheresse 
        weatherCondition === 'Flood' || //inondation
        weatherCondition === 'Tsunami' || //tsunami
        weatherCondition === 'Storm' || //tempête 
        weatherCondition === 'Clear' //

      ) {
        setShowAlert(true); // Afficher l'alerte météo
      } else {
        setShowAlert(false); // Alerte masquée si pas d'événement météo

      }
    }
  }, [geoLocationWeather]);

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
            value={city}
          >
            <option value="">--Choisissez une ville--</option>
            {preferredCities.map((citySelect, index) => (
              <option key={index} value={citySelect}>
                {citySelect}
              </option>
            ))}
          </select>
        </div>
      )}
      {showAlert && alertMessage && (
        <div className="alert-container">
          <div className="alert-message">
            {alertMessage}
            <button className="close-alert-btn" onClick={closeAlert}>✖</button>
          </div>
        </div>
      )}
      <Weather
        city={city}
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
