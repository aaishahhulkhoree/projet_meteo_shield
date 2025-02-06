import React from 'react';
import "../assets/styles/tsunami.css"

import PropTypes from 'prop-types'; // Import de PropTypes pour la validation des props

// Définition du composant TsunamiAlert, qui affiche une alerte en cas de tsunami
const TsunamiAlert = ({ tsunamiWarning }) => {
  // Vérification si une alerte de tsunami a été détectée
  if (tsunamiWarning && tsunamiWarning.detected) {
    return (
      <div className="alert tsunami-alert">
        <h3>🌊 Alerte Tsunami !</h3>
        <p><strong>Lieu :</strong> {tsunamiWarning.location}</p> {/* Affiche le lieu du tsunami */}
        <p><strong>Gravité :</strong> {tsunamiWarning.severity}</p> {/* Affiche la gravité de l'alerte */}
        <p><strong>Heure de l&apos;alerte :</strong> {new Date(tsunamiWarning.alertTime).toLocaleString()}</p> {/* Affiche l'heure de l'alerte sous un format local */}
        <p>Un tsunami a été détecté. Veuillez prendre des précautions immédiates.</p> {/* Message d'avertissement */}
      </div>
    );
  }

  // Si aucun tsunami n'est détecté, ne rien afficher
  return null;
};

// Définir les PropTypes pour valider les props du composant TsunamiAlert
TsunamiAlert.propTypes = {
  // tsunamiWarning est un objet qui doit avoir les propriétés suivantes :
  tsunamiWarning: PropTypes.shape({
    detected: PropTypes.bool.isRequired, // 'detected' est un booléen et est requis
    location: PropTypes.string.isRequired, // 'location' est une chaîne de caractères et est requis
    severity: PropTypes.string.isRequired, // 'severity' est une chaîne de caractères et est requis
    alertTime: PropTypes.string.isRequired, // 'alertTime' est une chaîne et est requise
  }).isRequired, // tsunamiWarning est un objet requis
};

export default TsunamiAlert;
