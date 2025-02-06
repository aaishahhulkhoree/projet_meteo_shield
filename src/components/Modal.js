import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import de PropTypes
import '../assets/styles/modal.css';

/**
 * Composant Modal : Affiche un menu avec des options de navigation et de déconnexion.
 * 
 * @param {Object} props - Propriétés passées au composant.
 * @param {Function} props.toggleModal - Fonction pour fermer le modal.
 */
const Modal = ({ toggleModal }) => {
  const navigate = useNavigate();

   /**
   * Gère la navigation vers une page spécifique.
   * Ferme le modal avant d'effectuer la redirection.
   * 
   * @param {string} route - La route vers laquelle rediriger l'utilisateur.
   */
  const handleNavigation = (route) => {
    toggleModal(); // Ferme le modal
    navigate(route); // Redirige vers la route souhaitée
  };

   /**
   * Gère la déconnexion de l'utilisateur.
   * Efface les données stockées dans localStorage et redirige vers la page d'accueil.
   */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
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
