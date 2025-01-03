import React from 'react';
import { render, screen } from '@testing-library/react';
import DroughtAlert from '../DroughtAlert';

describe('DroughtAlert', () => {
  // Test pour alerte de sécheresse (temp > 30°C, humidité < 30%, pluie < 1 mm)
  test('affiche une alerte sécheresse lorsque les conditions sont remplies (température élevée, faible humidité, et absence de pluie)', () => {
    const props = { rain: { '1h': 0 }, humidity: 25, temp: 35 };

    render(<DroughtAlert {...props} />);

    expect(screen.getByText(/Alerte Sécheresse !/i)).toBeInTheDocument();
    expect(screen.getByText(/température élevée à 35°C/i)).toBeInTheDocument();
    expect(screen.getByText(/humidité faible \(25%\)/i)).toBeInTheDocument();
  });

  // Test pour vérifier qu'aucune alerte n'est affichée si la pluie est présente
  test('n\'affiche pas d\'alerte sécheresse s\'il y a des précipitations', () => {
    const props = { rain: { '1h': 2 }, humidity: 25, temp: 35 };

    render(<DroughtAlert {...props} />);

    expect(screen.queryByText(/Alerte Sécheresse !/i)).not.toBeInTheDocument();
  });

  // Test pour vérifier qu'aucune alerte n'est affichée si l'humidité est suffisante
  test('n\'affiche pas d\'alerte sécheresse si l\'humidité est suffisante', () => {
    const props = { rain: { '1h': 0 }, humidity: 40, temp: 35 };

    render(<DroughtAlert {...props} />);

    expect(screen.queryByText(/Alerte Sécheresse !/i)).not.toBeInTheDocument();
  });

  // Test pour vérifier qu'aucune alerte n'est affichée si la température est basse
  test('n\'affiche pas d\'alerte sécheresse si la température est inférieure ou égale à 30°C', () => {
    const props = { rain: { '1h': 0 }, humidity: 25, temp: 28 };

    render(<DroughtAlert {...props} />);

    expect(screen.queryByText(/Alerte Sécheresse !/i)).not.toBeInTheDocument();
  });
});
