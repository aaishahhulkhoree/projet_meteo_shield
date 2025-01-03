import React from 'react';
import { render, screen } from '@testing-library/react';
import StormAlert from '../StormAlert';

// Test pour vérifier que l'alerte s'affiche quand les conditions sont remplies
test('affiche l\'alerte tempête lorsque les conditions de vent sont sévères', () => {
  const windSpeed = 35; // Vent régulier > 30 km/h
  const windGust = 65;  // Rafales > 60 km/h
  const forecastWindSpeed = 60; // Prévision > 50 km/h

  render(<StormAlert windSpeed={windSpeed} windGust={windGust} forecastWindSpeed={forecastWindSpeed} />);
  
  // Vérifier si le texte d'alerte est présent
  expect(screen.getByText(/Alerte Tempête/i)).toBeInTheDocument();
  expect(screen.getByText(`Rafales de vent violentes détectées avec une vitesse de ${windGust} km/h.`)).toBeInTheDocument();
  expect(screen.getByText(/Prévisions : vent supérieur à 50 km\/h dans les prochaines heures./i)).toBeInTheDocument();
});

// Test pour vérifier qu'aucune alerte n'est affichée si les conditions ne sont pas remplies
test('n\'affiche pas d\'alerte si les conditions de vent sont normales', () => {
  const windSpeed = 10;  // Vent régulier < 30 km/h
  const windGust = 20;   // Rafales < 60 km/h
  const forecastWindSpeed = 30; // Prévision < 50 km/h

  render(<StormAlert windSpeed={windSpeed} windGust={windGust} forecastWindSpeed={forecastWindSpeed} />);
  
  // Vérifier que l'alerte n'est pas affichée
  expect(screen.queryByText(/Alerte Tempête/i)).not.toBeInTheDocument();
});

// Test pour vérifier que l'alerte s'affiche en fonction du vent régulier
test('affiche l\'alerte de vent violent avec la vitesse de vent régulière', () => {
  const windSpeed = 40;  // Vent régulier > 30 km/h
  const windGust = 20;   // Rafales < 60 km/h
  const forecastWindSpeed = 30; // Prévision < 50 km/h

  render(<StormAlert windSpeed={windSpeed} windGust={windGust} forecastWindSpeed={forecastWindSpeed} />);
  
  // Vérifier si le texte d'alerte pour vent régulier est présent
  expect(screen.getByText(`Vent violent détecté avec une vitesse de ${windSpeed} km/h.`)).toBeInTheDocument();
});

// Test pour vérifier que l'alerte s'affiche en fonction des rafales de vent
test('affiche l\'alerte de rafales de vent violentes', () => {
  const windSpeed = 20;  // Vent régulier < 30 km/h
  const windGust = 70;   // Rafales > 60 km/h
  const forecastWindSpeed = 30; // Prévision < 50 km/h

  render(<StormAlert windSpeed={windSpeed} windGust={windGust} forecastWindSpeed={forecastWindSpeed} />);
  
  // Vérifier si le texte d'alerte pour rafales de vent violentes est présent
  expect(screen.getByText(`Rafales de vent violentes détectées avec une vitesse de ${windGust} km/h.`)).toBeInTheDocument();
});
