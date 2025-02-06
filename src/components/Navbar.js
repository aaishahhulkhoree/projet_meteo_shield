import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/navbar.css'; // Import du fichier CSS mis à jour
import Modal from './Modal'; // Import du composant Modal

/**
 * Composant Navbar - Barre de navigation du site
 * 
 * Cette barre de navigation permet à l'utilisateur de naviguer entre les différentes pages du site.
 * Elle affiche également un message de bienvenue si l'utilisateur est connecté et inclut un menu déroulant.
 */
const Navbar = () => {
  // État pour gérer l'ouverture et la fermeture du menu modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // État pour stocker le nom d'utilisateur
  const [username, setUsername] = useState('');

  /**
   * Fonction pour ouvrir ou fermer le menu modal
   */
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  /**
   * Fonction pour rafraîchir la page lorsqu'on clique sur le titre "MétéoShield"
   */
  const handleRefreshClick = () => {
    // Rafraîchissement de la page
    window.location.reload();
  };

  /**
   * useEffect qui s'exécute au montage du composant :
   * - Récupère le nom d'utilisateur depuis le localStorage
   * - Met en place un rafraîchissement automatique de la page toutes les 4 heures
   */
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
    }

    // Mise en place de l'actualisation automatique toutes les 4 heures
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 14400000); // 4 heures en millisecondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lors du démontage du composant
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Bouton de rafraîchissement à la place du lien MétéoShield */}
        <button className="nav-link refresh-btn" onClick={handleRefreshClick}>
          MétéoShield
        </button>

        {/* Message de bienvenue sous le titre */}
        {username && <div className="nav-username">Bienvenue, {username} !</div>}
      </div>

      <div className="navbar-right">
        <nav className="navbar-links">
          <Link to="/forecast" className="nav-link">Prévisions</Link>
          <Link to="/map" className="nav-link">Carte</Link>
        </nav>

        {/* Bouton Menu */}
        <button className="menu-btn" onClick={toggleModal}>
          ☰ Menu
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <Modal toggleModal={toggleModal} />}
    </header>
  );
};

export default Navbar;
