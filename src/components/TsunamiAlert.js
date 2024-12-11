import React from 'react';

const TsunamiAlert = ({ tsunamiWarning }) => {
  if (tsunamiWarning && tsunamiWarning.detected) {
    return (
      <div className="alert tsunami-alert">
        <h3>Alerte Tsunami !</h3>
        <p><strong>Lieu :</strong> {tsunamiWarning.location}</p>
        <p><strong>Gravité :</strong> {tsunamiWarning.severity}</p>
        <p><strong>Heure de l'alerte :</strong> {new Date(tsunamiWarning.alertTime).toLocaleString()}</p>
        <p>Un tsunami a été détecté. Veuillez prendre des précautions immédiates.</p>
      </div>
    );
  }
  return null;
};

export default TsunamiAlert;
