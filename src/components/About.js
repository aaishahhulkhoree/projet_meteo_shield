import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/about.css';

/**
 * Composant About - Présente les informations sur l'application MeteoShield.
 * Ce composant affiche une description des fonctionnalités et de la mission de l'application.
 */
const About = () => {
  const navigate = useNavigate(); // Hook pour la navigation entre les pages

  /**
   * Fonction pour rediriger l'utilisateur vers la page d'accueil.
   */
  const goHome = (event) => {
    navigate('/'); // Redirige vers la page d'accueil
  };

  return (
    <div className="about-container">
      {/* Bouton retour à l'accueil en haut */}
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>

      {/* Titre principal de la section "À propos" */}
      <h2>À propos de MeteoShield</h2>
      <p>
        {/* Présentation de MeteoShield et sa mission principale */}
        <strong>MeteoShield</strong> est un site web innovant conçu pour fournir des informations météorologiques essentielles et alertes météorologiques en temps réel. Nous mettons un accent particulier 
        sur la sécurité face aux événements extrêmes comme les tempêtes, les vagues de chaleur, les inondations, 
        et les tsunamis.
      </p>
      <p>
        {/* Explication des technologies utilisées et des alertes personnalisées */}
        Grâce à une technologie de géolocalisation avancée et de notification personnalisée,
        MeteoShield permet à chaque utilisateur de recevoir une alerte précise et adaptée à sa localisation
        et à ses préférences en termes de type d&apos;événement. Vous pouvez ainsi être informé des
        conditions météorologiques à risque, où que vous soyez.
      </p>
      
      <h3>Fonctionnalités principales :</h3>
      <ul>
        {/* Liste des fonctionnalités disponibles sur l'application */}
        <li>Alerte personnalisée pour les événements météorologiques extrêmes (tempêtes, sécheresse, tsunamis, etc.).</li>
        <li>Géolocalisation en temps réel pour des alertes spécifiques à votre ville.</li>
        <li>Visualisation interactive affichant une carte et une température lorsque l&apos;on clique sur une zone.</li>
        <li>Prévisions détaillées heure par heure et sur 5 jours.</li>
      </ul>
      
      <h3>Notre Mission</h3>
      <p>
        {/* Explication des objectifs de MeteoShield et son engagement envers les utilisateurs */}
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
