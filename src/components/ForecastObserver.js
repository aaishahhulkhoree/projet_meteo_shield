import React, { useEffect, useState } from 'react';
import PrevisionMeteo from '../utils/PrevisionMeteo';
import '../assets/styles/forecast.css';

/**
 * Composant React affichant les previsions meteo sur 7 jours.
 * Utilise la geolocalisation pour determiner la ville actuelle ou recupere les previsions pour une ville donnee.
 */

const ForecastObserver = () => {
  const [forecast, setForecast] = useState(null); // Etat pour stocker les donnees des previsions
  const [error, setError] = useState(''); // Etat pour stocker les messages d'erreur
  const [city, setCity] = useState(''); // Etat pour stocker le nom de la ville actuelle

  // useEffect qui s'execute une fois au montage du composant
  useEffect(() => {
    const observer = {
      // Methode appelee pour mettre a jour les previsions lorsque les donnees changent
      mettreAJour: (data) => {
        if (data) {
          setForecast(data); // Mettre a jour les donnees des previsions
          setCity(data.city.name); // Mettre a jour le nom de la ville
        }
      },
    };

    // Ajouter cet observateur pour recevoir les mises a jour de PrevisionMeteo
    PrevisionMeteo.ajouterObserver(observer);

    // Fonction pour recuperer la geolocalisation de l'utilisateur et mettre a jour les previsions
    const fetchLocationAndForecast = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const cityName = await PrevisionMeteo.getCityName(latitude, longitude); // Convertir les coordonnees en nom de ville
              setCity(cityName); // Mettre a jour la ville
              await PrevisionMeteo.mettreAJourPrevisions(cityName); // Mettre a jour les previsions meteo
            },
            (geoError) => {
              console.error('Erreur de geolocalisation :', geoError);
              setError("Impossible d'obtenir votre localisation."); // Gestion des erreurs de geolocalisation
            }
          );
        } else {
          console.error("La geolocalisation n'est pas disponible.");
          setError("La geolocalisation n'est pas disponible sur ce navigateur."); // Si la geolocalisation n'est pas supportee
        }
      } catch (err) {
        console.error('Erreur lors de la recuperation des previsions :', err);
        setError('Erreur lors du chargement des previsions meteo.');
      }
    };

    fetchLocationAndForecast();

    // Nettoyer l'observateur lors du demontage du composant
    return () => {
      PrevisionMeteo.retirerObserver(observer);
    };
  }, []);

  // Afficher un message d'erreur si une erreur est survenue
  if (error) {
    return <div className="forecast-container">{error}</div>;
  }

  // Afficher un message de chargement si les donnees des previsions ne sont pas encore disponibles
  if (!forecast) {
    return <div className="forecast-container">Chargement des prévisions...</div>;
  }

  // Grouper les donnees par jour et calculer les temperatures minimale et maximale
  const groupedData = forecast.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0]; // Extraire la date
    if (!acc[date]) {
      acc[date] = { min: item.main.temp_min, max: item.main.temp_max, weather: item.weather[0].description };
    } else {
      acc[date].min = Math.min(acc[date].min, item.main.temp_min);
      acc[date].max = Math.max(acc[date].max, item.main.temp_max);
    }
    return acc;
  }, {});

  // Transformer les donnees groupees en tableau pour affichage
  const dailyForecasts = Object.entries(groupedData).map(([date, data]) => ({
    date,
    min: data.min,
    max: data.max,
    description: data.weather,
  }));

  return (
    <div className="forecast-container">
      <h1>Prévisions météo pour {city || 'votre ville'}</h1>
      <h2>Prévisions sur 7 jours</h2>
      <div className="daily-forecast">
        {dailyForecasts.map((item, index) => (
          <div key={index} className="forecast-card">
            <h4>{new Date(item.date).toLocaleDateString()}</h4>
            <p>Temp. min : {item.min}°C</p>
            <p>Temp. max : {item.max}°C</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastObserver;
