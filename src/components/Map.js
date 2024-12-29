import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../assets/styles/map.css';
import { FaMapPin } from 'react-icons/fa';
import L from 'leaflet';

const Map = () => {
  const [position, setPosition] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const center = [20.0, 0.0]; // Centre de la carte (pour afficher l'ensemble du monde)

  // Fonction pour récupérer la température via l'API OpenWeather
  const getTemperature = async (lat, lng) => {
    const apiKey = 'fd441e159a57c88c956ebf246cc1ae9c';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      setTemperature(Math.round(response.data.main.temp)); // Température arrondie
    } catch (error) {
      console.error("Erreur de récupération des données météo", error);
    }
  };

  // Fonction pour récupérer le nom du lieu, code postal et pays via l'API Nominatim de OpenStreetMap
  const getPlaceName = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
      const response = await axios.get(url);
      const city = response.data.address.city || response.data.address.town || response.data.address.village || '';
      setPlaceName(city); // Si le nom de la ville existe, il est défini, sinon il est vide
      setPostalCode(response.data.address.postcode || ''); // Ne pas afficher "Code postal non disponible" s'il est vide
      setCountry(response.data.address.country || ''); // Ne pas afficher "Pays non disponible" s'il est vide
    } catch (error) {
      console.error("Erreur de récupération du nom du lieu", error);
      setPlaceName('');
      setPostalCode('');
      setCountry('');
    }
  };

  // Composant pour capturer les clics sur la carte
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        getTemperature(lat, lng); // Récupérer la température du lieu cliqué
        getPlaceName(lat, lng); // Récupérer le nom du lieu, code postal et pays
      },
    });

    // Créer l'icône Pushpin de FontAwesome et l'utiliser comme icône personnalisée
    const customIcon = L.divIcon({
      className: 'leaflet-icon-pushpin', // Classe CSS pour l'icône personnalisée
      html: `<i class="fa fa-map-pin" style="font-size: 25px; color: red;"></i>`,
      iconSize: [25, 25], // Taille de l'icône
      iconAnchor: [12, 25], // Position de l'ancrage de l'icône
      popupAnchor: [0, -25], // Position du popup
    });

    return position ? (
      <Marker position={position} icon={customIcon}>
        <Popup>
          {placeName && <strong>{placeName}</strong>}<br />
          {postalCode && <span>{postalCode}, </span>}
          {country && <span>{country}</span>}
          {temperature !== null && (
            <div className="temperature">
              Température : <span>{temperature}°C</span>
            </div>
          )}
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={2} className="map-interactive">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marqueur interactif pour les clics */}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default Map;
