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

  const handleHomeClick = () => {
    // Rechargement de la page en forçant une navigation vers la racine
    window.location.href = '/';
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Titre de l'application */}
        <Link to="/" className="nav-link" onClick={handleHomeClick}>MétéoShield</Link>

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
