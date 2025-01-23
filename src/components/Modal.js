import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import de PropTypes
import '../assets/styles/modal.css';

const Modal = ({ toggleModal }) => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    toggleModal(); // Ferme le modal
    navigate(route); // Redirige vers la route souhaitée
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Supprime le userId
    localStorage.removeItem('username'); // Supprimer le pseudo
    window.location.href = '/'; // Rediriger vers Home
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <h3>Menu</h3>
        <button onClick={() => handleNavigation('/login')}>Connexion</button>
        <button onClick={() => handleNavigation('/signup')}>Inscription</button>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
        <button onClick={() => handleNavigation('/settings')}>Paramètres</button>
        <button onClick={() => handleNavigation('/about')}>À propos</button>
        <button className="close-btn" onClick={toggleModal}>❌ Fermer</button>
      </div>
    </div>
  );
};

// Définir les PropTypes pour valider les props du composant Modal
Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired, // toggleModal doit être une fonction et est requise
};

export default Modal;
