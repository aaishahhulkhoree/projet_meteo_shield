import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/navbar.css'; // Import du fichier CSS mis à jour
import Modal from './Modal'; // Import du composant Modal

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRefreshClick = () => {
    // Rafraîchissement de la page
    window.location.reload();
  };

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
