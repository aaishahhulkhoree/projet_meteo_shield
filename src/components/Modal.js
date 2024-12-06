import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/modal.css';

const Modal = ({ toggleModal }) => {
  const navigate = useNavigate();

  // Gestionnaire pour rediriger vers la page de connexion
  const handleConnexionClick = () => {
    toggleModal(); // Ferme le modal
    navigate('/login'); // Redirige vers la page de connexion
  };

  // Gestionnaire pour rediriger vers la page d'inscription
  const handleInscriptionClick = () => {
    toggleModal(); // Ferme le modal
    navigate('/signup'); // Redirige vers la page d'inscription
  };

  // Gestionnaire pour rediriger vers la page des paramètres
  const handleParametresClick = () => {
    toggleModal(); // Ferme le modal
    navigate('/settings'); // Redirige vers la page des paramètres
  };

  // Gestionnaire pour rediriger vers la page À propos
  const handleAboutClick = () => {
    toggleModal(); // Ferme le modal
    navigate('/about'); // Redirige vers la page À propos
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <h3>Menu</h3>
        {/* Chaque bouton exécute une fonction spécifique */}
        <button onClick={handleConnexionClick}>Connexion</button>
        <button onClick={handleInscriptionClick}>Inscription</button>
        <button onClick={handleParametresClick}>Paramètres</button>
        <button onClick={handleAboutClick}>À propos</button>
        <button onClick={toggleModal}>Fermer</button>
      </div>
    </div>
  );
};

export default Modal;
