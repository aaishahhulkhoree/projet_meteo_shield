import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/settings.css';

const Settings = () => {
  const [alertType, setAlertType] = useState([]); // Gère les types d'alertes météo sélectionnés
  const [temperatureUnit, setTemperatureUnit] = useState(
    localStorage.getItem('temperatureUnit') || 'C' // Récupère l'unité de température de localStorage ou utilise 'C' par défaut
  );
  const [preferredCities, setPreferredCities] = useState([]); // Gère les villes préférées de l'utilisateur
  const [cityInput, setCityInput] = useState(''); // Gère l'entrée de l'utilisateur pour les villes
  const [citySuggestions, setCitySuggestions] = useState([]); // Gère les suggestions de villes
  const [isUserConnected, setIsUserConnected] = useState(false); // Gère si l'utilisateur est connecté ou non
  const navigate = useNavigate(); // Utilisé pour la navigation vers d'autres pages
  const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c'; // Clé API pour récupérer les données météorologiques

  // Effet de bord qui récupère les préférences et les villes favorites de l'utilisateur lors du chargement de la page
  useEffect(() => {
    const fetchPreferencesAndCities = async () => {
      const userId = localStorage.getItem('userId'); // Récupère l'ID utilisateur stocké
      setIsUserConnected(!!userId); // Vérifie si l'utilisateur est connecté
      if (!userId) {
        // Si non connecté, on charge les paramètres stockés localement
        const storedTemperatureUnit = localStorage.getItem('temperatureUnit') || 'C';
        setTemperatureUnit(storedTemperatureUnit);
      }
      else {
        try {
          // Si l'utilisateur est connecté, on récupère ses préférences via l'API
          const preferencesResponse = await fetch(`http://localhost:5000/api/preferences-utilisateur/${userId}`);
          if (preferencesResponse.ok) {
            const preferencesData = await preferencesResponse.json();
            setTemperatureUnit(preferencesData.temperatureUnit || 'C');
            setAlertType(preferencesData.alertType || []);
          }

          // On récupère aussi les villes favorites de l'utilisateur
          const citiesResponse = await fetch(`http://localhost:5000/api/villes-favorites/${userId}`);
          if (citiesResponse.ok) {
            const citiesData = await citiesResponse.json();
            setPreferredCities(citiesData.villes || []);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      }
    };

    fetchPreferencesAndCities(); // Appel de la fonction pour récupérer les données
  }, []); // L'effet s'exécute une seule fois lors du montage du composant

  // Fonction pour récupérer les suggestions de villes en fonction de la saisie de l'utilisateur
  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) { // Si la saisie est inférieure à 3 caractères, on ne cherche pas de suggestions
      setCitySuggestions([]);
      return;
    }

    try {
      // Appel de l'API pour récupérer les villes correspondant à la recherche
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      const data = await response.json();

      // Suppression des doublons dans les suggestions de villes
      const uniqueSuggestions = data
        .map((city) => ({
          name: city.name,
          country: city.country,
        }))
        .filter(
          (city, index, self) =>
            index === self.findIndex(
              (c) => c.name === city.name && c.country === city.country
            )
        );

      setCitySuggestions(uniqueSuggestions); // Met à jour les suggestions de villes
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions de villes :', error);
    }
  };

  // Fonction pour ajouter une ville aux villes préférées
  const handleAddCity = (city) => {
    if (!preferredCities.includes(city.name)) { // Si la ville n'est pas déjà dans la liste
      setPreferredCities((prev) => [...prev, city.name]); // Ajouter la ville
    }
    setCityInput(''); // Réinitialiser l'entrée de ville
    setCitySuggestions([]); // Réinitialiser les suggestions
  };

  // Fonction pour supprimer une ville des villes préférées
  const handleRemoveCity = (cityName) => {
    setPreferredCities((prev) => prev.filter((city) => city !== cityName)); // Filtrer pour supprimer la ville
  };

  // Fonction pour activer/désactiver un type d'alerte
  const handleToggleAlert = (alert) => {
    setAlertType((prevAlerts) =>
      prevAlerts.includes(alert)
        ? prevAlerts.filter((a) => a !== alert) // Supprime si déjà sélectionné
        : [...prevAlerts, alert] // Ajoute si non sélectionné
    );
  };

  // Fonction pour sauvegarder les préférences de l'utilisateur
  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Si non connecté, on sauvegarde les préférences dans le localStorage
      localStorage.setItem('temperatureUnit', temperatureUnit);
      alert('Préférences sauvegardées localement.');
      navigate('/'); // Redirection vers la page d'accueil
    }
    else {
      try {
        // Sauvegarde des préférences et des villes favorites via l'API
        const preferencesResponse = await fetch('http://localhost:5000/api/preferences-utilisateur', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            temperatureUnit,
            alertType,
          }),
        });

        const citiesResponse = await fetch('http://localhost:5000/api/villes-favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            villes: preferredCities,
          }),
        });

        if (preferencesResponse.ok && citiesResponse.ok) {
          alert('Préférences sauvegardées avec succès.');
          navigate('/'); // Redirection vers la page d'accueil
        } else {
          alert('Erreur lors de la sauvegarde des préférences.');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des préférences :', error);
      }
    }
  };

  // Fonction de navigation vers la page d'accueil
  const goHome = () => navigate('/');

  return (
    <div className="settings-container">
      <button className="home-btn" onClick={goHome}> <span> Retour à l&apos;accueil</span></button>
      <h1>Paramètres</h1>
      <div className="setting-option">
        <label>Unité de température :</label>
        <select value={temperatureUnit} onChange={(e) => setTemperatureUnit(e.target.value)}>
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
        </select>
      </div>
      {isUserConnected && (
        <div className="setting-option">
          <label>Type d&apos;alerte météo :</label>
          <div className="alert-options">
            {["storm", "heatwave", "rain", "earthquake", "tsunami", "flood"].map((alert) => (
              <button
                key={alert}
                className={`alert-button ${alertType.includes(alert) ? "selected" : ""}`}
                onClick={() => handleToggleAlert(alert)}
              >
                {alert.charAt(0).toUpperCase() + alert.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      {isUserConnected && (
      <div className="setting-option">
        <h3>Villes préférées :</h3>
        <div>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            placeholder="Ajoutez une ville"
            className="city-input-container"
          />
        </div>
        
        <div className="suggestions-dropdown">
          {citySuggestions.map((city, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleAddCity(city)}
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>        
        <ul>
          {preferredCities.map((city, index) => (
            <li key={index}>
              {city}
              <button className="delete-button" onClick={() => handleRemoveCity(city)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
      )}
      <button className="save-button" onClick={handleSave}>Sauvegarder</button>
    </div>
  );
};

export default Settings;
