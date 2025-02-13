import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signup.css';

const SignUp = () => {
  // Déclaration des états locaux pour gérer les entrées de l'utilisateur
  const [pseudo, setPseudo] = useState(''); // Pseudo de l'utilisateur
  const [email, setEmail] = useState(''); // Email de l'utilisateur
  const [motdepasse, setMotdepasse] = useState(''); // Mot de passe de l'utilisateur
  const [showPassword, setShowPassword] = useState(false); // Gère la visibilité du mot de passe
  const [error, setError] = useState(''); // État pour gérer les erreurs de validation
  const navigate = useNavigate(); // Hook pour la navigation entre les pages

  // Fonction pour valider l'email avec une expression régulière
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Fonction pour valider le mot de passe (minimum 8 caractères, au moins une majuscule, un chiffre et un caractère spécial)
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Fonction pour gérer l'envoi du formulaire d'inscription
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de l'envoi du formulaire

    // Validation des types et des valeurs
    if (typeof pseudo !== 'string' || pseudo.trim() === '') {
      setError('Le pseudo doit être une chaîne de caractères non vide.');
      return;
    }

    if (!validateEmail(email)) {
      setError('L\'email fourni n\'est pas valide.');
      return;
    }

    if (!validatePassword(motdepasse)) {
      setError('Le mot de passe doit comporter au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.');
      return;
    }

    setError(''); // Réinitialise l'erreur si toutes les validations sont réussies

    try {
      // Envoi des données d'inscription au serveur via une requête POST
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: pseudo.trim(),
          email: email.trim(),
          motdepasse: motdepasse.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inscription réussie.');
        setPseudo('');
        setEmail('');
        setMotdepasse('');
        navigate('/'); // Redirige vers la page d'accueil
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Erreur interne du serveur.');
    }
  };

  // Fonction pour revenir à la page d'accueil
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="signup-container">
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        {/* Champ pour le pseudo */}
        <div className="form-group">
          <label htmlFor="Pseudo">Pseudo :</label>
          <input
            type="text"
            id="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
            className="signup-input"
          />
        </div>

        {/* Champ pour l'email */}
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />
        </div>

        {/* Champ pour le mot de passe */}
        <div className="form-group">
          <label htmlFor="motdepasse">Mot de passe :</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="motdepasse"
              value={motdepasse}
              onChange={(e) => setMotdepasse(e.target.value)}
              required
              className="signup-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="save-button">S&apos;inscrire</button>
      </form>
    </div>
  );
};

export default SignUp;
