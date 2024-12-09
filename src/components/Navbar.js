import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ajout du lien de navigation
import '../assets/styles/navbar.css';
import Modal from './Modal';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="navbar">
      <h2 className="navbar-title">🌩️ MétéoShield</h2> {/* Icône d'orage ajoutée */}
      <nav className="navbar-links">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/forecast" className="nav-link">Prévisions</Link>
        <Link to="/map" className="nav-link">Carte</Link>
        <Link to="/settings" className="nav-link">Paramètres</Link>
      </nav>
      <button className="menu-btn" onClick={toggleModal}>
        ☰ Menu
      </button>
      {isModalOpen && <Modal toggleModal={toggleModal} />}
    </header>
  );
};

export default Navbar;
