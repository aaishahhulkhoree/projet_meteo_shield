import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/home.css';
import Weather from './Weather';
import Navbar from './Navbar';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [city, setCity] = useState('');
  const [preferredCities] = useState(() => {
    const savedCities = localStorage.getItem('preferredCities');
    return savedCities ? JSON.parse(savedCities) : [];
  });
  const [temperature, setTemperature] = useState('');
  const [weather, setWeather] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [geoLocationWeather, setGeoLocationWeather] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Alerte par défaut masquée
  const navigate = useNavigate();

  // Fonction pour récupérer la météo selon la géolocalisation
  const fetchWeatherByGeoLocation = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=fd441e159a57c88c956ebf246cc1ae9c`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert('Impossible de récupérer les données météo.');
      } else {
        setGeoLocationWeather(data);
        checkWeatherAlerts(data); // Vérification des alertes météo
      }
    } catch (error) {
      console.error('Erreur de récupération des données météo :', error);
      alert('Erreur de récupération des données météo.');
    }
  };

  // Fonction pour vérifier les alertes météo (ex: tempêtes, fortes pluies, etc.)
  const checkWeatherAlerts = (data) => {
    const weatherCondition = data.weather[0].main;
    const cityName = data.name; // Récupérer le nom de la ville
    console.log(cityName);
    console.log(weatherCondition);
    switch (weatherCondition) {
      case 'Thunderstorm':
        setAlertMessage(`Alerte : Orage violent en cours à ${cityName}.`);
        break;
      case 'Rain':
        setAlertMessage(`Alerte : Pluie intense à ${cityName}.`);
        break;
      case 'Snow':
        setAlertMessage(`Alerte : Chutes de neige à ${cityName}.`);
        break;
      case 'Mist':
      case 'Fog':
        setAlertMessage(`Alerte : Brume ou brouillard à ${cityName}.`);
        break;
      case 'Extreme':
        setAlertMessage(`Alerte : Conditions météo extrêmes à ${cityName}. Restez en sécurité !`);
        break;
        case 'Tsunami':
          setAlertMessage(`Alerte : Risque de tsunami à ${cityName}. Éloignez-vous des côtes !`);
          break;
      default:
        if (weatherCondition === 'Drought'){
          setAlertMessage(`Alerte : Sécheresse à ${cityName}. Prenez des précautions !`);
        } else if (weatherCondition === 'Flood') {
          setAlertMessage(`Alerte : Inondation à ${cityName}. Restez en sécurité !`);
        } else if (weatherCondition === 'Storm'){
          setAlertMessage('Alerte : Tempête à ${cityName}. Ne sortez pas !');
        } else {
          setAlertMessage('Aucune Alerte Extrême Détéctée');
        }
    }
  };

  // Fonction pour fermer l'alerte
  const closeAlert = () => {
    setShowAlert(false); // Fermer l'alerte
  };

  // Récupérer la position géographique de l'utilisateur et afficher la météo correspondante
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

  // Gestion de la recherche via la barre de recherche
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

  // Gestion de la sélection via la liste des villes préférées
  const handleCitySelect = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
    setAlertMessage('');
    navigate(`/${selectedCity}`);
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
        weatherCondition === 'Thunderstorm' ||
        weatherCondition === 'Rain' ||
        weatherCondition === 'Snow' ||
        weatherCondition === 'Mist' ||
        weatherCondition === 'Fog'  ||
        weatherCondition === 'Drought' ||
        weatherCondition === 'Flood' ||
        weatherCondition === 'Tsunami' ||
        weatherCondition === 'Storm'

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
              <option key={index} value={citySelect.name}>
                {citySelect.name}, {citySelect.country}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Affichage de l'alerte météo si disponible */}
      {showAlert && alertMessage && (
        <div className="alert-container">
          <div className="alert-message">
            {alertMessage}
            {/* Bouton de fermeture avec un design amélioré */}
<button className="close-alert-btn" onClick={closeAlert}>
  ✖
</button>
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
