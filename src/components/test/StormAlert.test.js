import React from 'react';
import { render, screen } from '@testing-library/react';
import StormAlert from '../StormAlert';

// Test pour vérifier que l'alerte s'affiche lorsque les conditions de vent régulier sont sévères
test('affiche une alerte de vent violent lorsque la vitesse du vent régulier dépasse 30 km/h', () => {
  const windSpeed = 35; // Vent régulier > 30 km/h
  const forecastWindSpeed = 30; // Prévision < 50 km/h

  render(<StormAlert windSpeed={windSpeed} forecastWindSpeed={forecastWindSpeed} />);
  
  expect(screen.getByText(/Alerte Tempête !/i)).toBeInTheDocument();
  expect(screen.getByText(`Vent violent détecté avec une vitesse de ${Math.round(windSpeed)} km/h.`)).toBeInTheDocument();
});

// Test pour vérifier qu'aucune alerte n'est affichée si les conditions ne sont pas remplies
test('n\'affiche pas d\'alerte si les conditions de vent sont normales', () => {
  const windSpeed = 10;  // Vent régulier < 30 km/h
  const forecastWindSpeed = 30; // Prévision < 50 km/h

  render(<StormAlert windSpeed={windSpeed} forecastWindSpeed={forecastWindSpeed} />);
  
  expect(screen.queryByText(/Alerte Tempête !/i)).not.toBeInTheDocument();
});

// Test pour vérifier que l'alerte s'affiche en fonction de la prévision de vent
test('affiche une alerte lorsque les prévisions annoncent un vent supérieur à 50 km/h', () => {
  const windSpeed = 20; // Vent régulier < 30 km/h
  const forecastWindSpeed = 55; // Prévision > 50 km/h

  render(<StormAlert windSpeed={windSpeed} forecastWindSpeed={forecastWindSpeed} />);
  
  expect(screen.getByText(/Alerte Tempête !/i)).toBeInTheDocument();
  expect(screen.getByText(/Prévisions : vent supérieur à 50 km\/h dans les prochaines heures./i)).toBeInTheDocument();
});

// Test pour vérifier que l'alerte de rafales de vent violentes s'affiche correctement
test('affiche une alerte de rafales de vent violentes lorsque la vitesse dépasse 60 km/h', () => {
  const windSpeed = 65; // Rafales de vent > 60 km/h
  const forecastWindSpeed = 30; // Prévision < 50 km/h

  render(<StormAlert windSpeed={windSpeed} forecastWindSpeed={forecastWindSpeed} />);
  
  expect(screen.getByText(/Alerte Tempête !/i)).toBeInTheDocument();
  expect(screen.getByText(`Rafales de vent violentes détectées avec une vitesse de ${Math.round(windSpeed)} km/h.`)).toBeInTheDocument();
});
