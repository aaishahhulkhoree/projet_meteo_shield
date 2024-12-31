import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/styles/weather.css';
import StormAlert from './StormAlert';
import TemperatureAlert from './TemperatureAlert';
import PrecipitationAlert from './PrecipitationAlert';
import DroughtAlert from './DroughtAlert';
import TsunamiAlert from './TsunamiAlert';
import EarthquakeAlert from './EarthquakeAlert';

const Weather = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState(
    localStorage.getItem('temperatureUnit') || 'C'
  );
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tsunamiWarning, setTsunamiWarning] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) return;

      try {
        const unit = temperatureUnit === 'C' ? 'metric' : 'imperial';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=fd441e159a57c88c956ebf246cc1ae9c`
        );
        const data = await response.json();
        setForecast(data);
        if (data.cod !== 200) {
          setError('Ville non trouvée ou données météo indisponibles.');
          setForecast(null);
        } else {
          setError('');
          setForecast(data);

          // Simuler des données d'alertes
          setEarthquakeData({ magnitude: 5, location: 'Tokyo' });
          setTsunamiWarning(true);
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération des données météo.');
      }
    };

    fetchWeatherData();
  }, [city, temperatureUnit]);

  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'C' ? 'F' : 'C';
    setTemperatureUnit(newUnit);
    localStorage.setItem('temperatureUnit', newUnit);
  };

  if (!forecast) {
    return <p>{error || 'Chargement des données météo...'}</p>;
  }

  return (
    <div className="weather-container">
      <h2>Météo pour {city}</h2>
      <p>Température : {forecast.main.temp}{temperatureUnit}</p>
      <p>Description : {forecast.weather[0].description}</p>
      <p>Vitesse du vent : {forecast.wind.speed} m/s</p>
      <button onClick={toggleTemperatureUnit}>
        Basculer en °{temperatureUnit === 'C' ? 'F' : 'C'}
      </button>

      {/* Section des alertes */}
      <h3>Alertes :</h3>
      <StormAlert windSpeed={forecast.wind.speed} />
      <TemperatureAlert temp={forecast.main.temp} unit={temperatureUnit} />
      <PrecipitationAlert rain={forecast.rain || 0} />
      <DroughtAlert rain={forecast.rain || 0} />
      <TsunamiAlert tsunamiWarning={tsunamiWarning} />
      <EarthquakeAlert earthquakeData={earthquakeData} />
    </div>
  );
};

Weather.propTypes = {
  city: PropTypes.string.isRequired,
};

export default Weather;
