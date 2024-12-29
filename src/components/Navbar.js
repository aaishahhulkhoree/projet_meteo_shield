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
      {/* Liens et bouton sur la même ligne */}
      <div className="navbar-left">
        <Link to="/" className="nav-link" onClick={handleHomeClick}>MétéoShield</Link> {/* Lien avec rafraîchissement */}
      </div>

      <div className="navbar-right">
        <nav className="navbar-links">
          <Link to="/forecast" className="nav-link">Prévisions</Link>
          <Link to="/map" className="nav-link">Carte</Link>
        </nav>

        {username && <span className="nav-username">Bienvenue, {username}!</span>} {/* Affiche le pseudo */}
        
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
