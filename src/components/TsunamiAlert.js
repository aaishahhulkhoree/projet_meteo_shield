import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const TsunamiAlert = ({ tsunamiWarning }) => {
  if (tsunamiWarning && tsunamiWarning.detected) {
    return (
      <div className="alert tsunami-alert">
        <h3>Alerte Tsunami !</h3>
        <p><strong>Lieu :</strong> {tsunamiWarning.location}</p>
        <p><strong>Gravité :</strong> {tsunamiWarning.severity}</p>
        <p><strong>Heure de l&apos;alerte :</strong> {new Date(tsunamiWarning.alertTime).toLocaleString()}</p>
        <p>Un tsunami a été détecté. Veuillez prendre des précautions immédiates.</p>
      </div>
    );
  }
  return null;
};

// Définir les PropTypes pour valider les props du composant TsunamiAlert
TsunamiAlert.propTypes = {
  tsunamiWarning: PropTypes.shape({
    detected: PropTypes.bool.isRequired, // Le champ 'detected' doit être un booléen et est requis
    location: PropTypes.string.isRequired, // 'location' doit être une chaîne et est requise
    severity: PropTypes.string.isRequired, // 'severity' doit être une chaîne et est requise
    alertTime: PropTypes.string.isRequired, // 'alertTime' doit être une chaîne et est requise
  }).isRequired, // tsunamiWarning est un objet requis
};

export default TsunamiAlert;
