import React from 'react';
import { render, screen } from '@testing-library/react';
import TsunamiAlert from '../TsunamiAlert.js';

describe('TsunamiAlert', () => {
  /* Test : afficher une alerte tsunami si les conditions sont remplies
  test('affiche une alerte tsunami lorsque le tsunami est détecté', () => {
    const props = {
      tsunamiWarning: {
        detected: true,
        location: 'Côte Pacifique',
        severity: 'Élevée',
        alertTime: '2025-01-03T10:00:00Z',
      },
    };

    render(<TsunamiAlert {...props} />);

    expect(screen.getByText(/Alerte Tsunami !/i)).toBeInTheDocument();
    expect(screen.getByText(/Lieu : Côte Pacifique/i)).toBeInTheDocument();
    expect(screen.getByText(/Gravité : Élevée/i)).toBeInTheDocument();
    expect(screen.getByText(/Heure de l'alerte :/i)).toBeInTheDocument();
    expect(screen.getByText(/Veuillez prendre des précautions immédiates./i)).toBeInTheDocument();
  });*/

  // Test : ne pas afficher d'alerte si le tsunami n'est pas détecté
  test('n\'affiche pas d\'alerte si le tsunami n\'est pas détecté', () => {
    const props = {
      tsunamiWarning: {
        detected: false,
        location: 'Côte Pacifique',
        severity: 'Élevée',
        alertTime: '2025-01-03T10:00:00Z',
      },
    };

    render(<TsunamiAlert {...props} />);

    expect(screen.queryByText(/Alerte Tsunami !/i)).not.toBeInTheDocument();
  });

  // Test : vérifier que le composant ne plante pas si les props sont invalides
  test('n\'affiche rien si tsunamiWarning est null', () => {
    render(<TsunamiAlert tsunamiWarning={null} />);
    expect(screen.queryByText(/Alerte Tsunami !/i)).not.toBeInTheDocument();
  });
});
