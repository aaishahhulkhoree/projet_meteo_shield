import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/about.css';

//interface AboutProps {}

const About = () => {
  const navigate = useNavigate();

  const goHome = (event) => {
    navigate('/');
  };

  return (
    <div className="about-container">
      {/* Bouton retour à l'accueil en haut */}
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>

      <h2>À propos de MeteoShield</h2>
      <p>
        <strong>MeteoShield</strong> est un site web innovant conçu pour
        fournir des alertes météorologiques en temps réel, avec une attention particulière
        portée aux événements extrêmes comme les tempêtes, sécheresses, tsunamis et autres
        phénomènes météorologiques qui peuvent mettre en danger la vie des utilisateurs.
      </p>
      <p>
        Grâce à une technologie de géolocalisation avancée et de notification personnalisée,
        MeteoShield permet à chaque utilisateur de recevoir une alerte précise et adaptée à sa localisation
        et à ses préférences en termes de type d&apos;événement. Vous pouvez ainsi être informé des
        conditions météorologiques à risque, où que vous soyez.
      </p>
      <h3>Fonctionnalités principales :</h3>
      <ul>
        <li>Alerte personnalisée pour les événements météorologiques extrêmes (tempêtes, sécheresse, tsunamis, etc.).</li>
        <li>Géolocalisation en temps réel pour des alertes spécifiques à votre ville.</li>
        <li>Visualisation interactive affichant une carte et une temperature lorsque l&apos;on clique sur une zone</li>
        <li>Prévisions détaillées heure par heure et sur 5 jours</li>
      </ul>
      <h3>Notre Mission</h3>
      <p>
        MeteoShield a pour objectif de rendre la surveillance des conditions météorologiques 
        plus accessible et réactive. En fournissant des alertes précises et des outils intuitifs, 
        nous aidons les individus et les communautés à mieux se préparer et à limiter les impacts 
        des événements climatiques extrêmes. Notre engagement : une interface claire, efficace et 
        accessible à tous.
      </p>
    </div>
  );
};

export default About;
