import React from 'react';
import { render, screen } from '@testing-library/react';
import PrecipitationAlert from '../PrecipitationAlert';

describe('PrecipitationAlert', () => {
  // Test pour la pluie extrême (> 100 mm)
  test('affiche une alerte de pluie extrême lorsque les précipitations dépassent 100 mm', () => {
    const rainData = { '1h': 120 };

    render(<PrecipitationAlert rain={rainData} />);

    expect(screen.getByText(/Alerte Pluie Extrême !/i)).toBeInTheDocument();
    expect(screen.getByText(/Précipitations torrentielles détectées : 120 mm dans la dernière heure/i)).toBeInTheDocument();
  });

  // Test pour la pluie forte (50 - 100 mm)
  test('affiche une alerte de pluie forte lorsque les précipitations sont entre 50 et 100 mm', () => {
    const rainData = { '1h': 75 };

    render(<PrecipitationAlert rain={rainData} />);

    expect(screen.getByText(/Alerte Pluie Forte !/i)).toBeInTheDocument();
    expect(screen.getByText(/Précipitations importantes détectées : 75 mm dans la dernière heure/i)).toBeInTheDocument();
  });

  // Test pour la pluie modérée (20 - 50 mm)
  test('affiche une alerte de pluie modérée lorsque les précipitations sont entre 20 et 50 mm', () => {
    const rainData = { '1h': 30 };

    render(<PrecipitationAlert rain={rainData} />);

    expect(screen.getByText(/Alerte Pluie Modérée !/i)).toBeInTheDocument();
    expect(screen.getByText(/Précipitations modérées détectées : 30 mm dans la dernière heure/i)).toBeInTheDocument();
  });

  // Test pour vérifier qu'aucune alerte n'est affichée si les précipitations sont inférieures à 20 mm
  test('n\'affiche pas d\'alerte si les précipitations sont inférieures à 20 mm', () => {
    const rainData = { '1h': 10 };

    render(<PrecipitationAlert rain={rainData} />);

    expect(screen.queryByText(/Alerte Pluie/i)).not.toBeInTheDocument();
  });
});
