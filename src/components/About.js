import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../assets/styles/about.css';

// Pas de props ici, mais si besoin, on peut ajouter un type pour les props
interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
  const navigate = useNavigate();

  const goHome = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigate('/'); 
  };

  return (
    <div className="about-container">
      {/* Bouton retour à l'accueil en haut */}
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l'accueil</span>
      </button>

      <h2>À propos de MeteoShield</h2>
      <p>
        <strong>MeteoShield</strong> est une application mobile innovante conçue pour
        fournir des alertes météorologiques en temps réel, avec une attention particulière
        portée aux événements extrêmes comme les tempêtes, sécheresses, tsunamis et autres
        phénomènes météorologiques qui peuvent mettre en danger la vie des utilisateurs.
      </p>
      <p>
        Grâce à une technologie de géolocalisation avancée et des notifications personnalisées,
        MeteoShield permet à chaque utilisateur de recevoir des alertes adaptées à sa localisation
        et à ses préférences en termes de type d'événement. Vous pouvez ainsi être informé des
        conditions météorologiques à risque, où que vous soyez.
      </p>
      <h3>Fonctionnalités clés :</h3>
      <ul>
        <li>Alertes personnalisées pour les événements météorologiques extrêmes (tempêtes, sécheresse, tsunamis, etc.).</li>
        <li>Géolocalisation en temps réel pour des alertes spécifiques à votre région.</li>
        <li>Visualisation interactive des zones de danger sur une carte, avec une distinction entre zones sûres et dangereuses.</li>
        <li>Mode jour/nuit pour une lecture facile des prévisions et alertes.</li>
        <li>Accès à des prévisions heure par heure et sur la semaine.</li>
        <li>Mode hors ligne avec des données simplifiées en cas de connexion limitée.</li>
        <li>Bouton SOS pour un accès rapide aux fonctions d'urgence.</li>
      </ul>
      <h3>Notre Mission</h3>
      <p>
        Notre mission est de rendre le suivi des conditions météorologiques extrêmes plus accessible,
        afin de protéger les individus et les communautés face aux dangers que peuvent représenter ces événements.
        MeteoShield s'efforce d'offrir une interface simple, claire et utile pour tous.
      </p>
    </div>
  );
};

export default About;
