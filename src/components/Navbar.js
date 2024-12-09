import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/navbar.css'; // Import du fichier CSS mis à jour
import Modal from './Modal'; // Import du composant Modal

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="navbar">
      {/* Liens et bouton sur la même ligne */}
      <div className="navbar-left">
        <Link to="/" className="nav-link">MétéoShield</Link>
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
