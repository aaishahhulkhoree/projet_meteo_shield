import React, { useState } from 'react';
import '../assets/styles/navbar.css';
import Modal from './Modal';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="navbar">
      <h2 className="navbar-title">MétéoShield</h2>
      <button className="menu-btn" onClick={toggleModal}>
        Menu
      </button>
      {isModalOpen && <Modal toggleModal={toggleModal} />} {/* Modal affiché lorsque le bouton est cliqué */}
    </div>
  );
};

export default Navbar;
