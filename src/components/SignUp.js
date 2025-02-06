import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signup.css';

const SignUp = () => {
  // Déclaration des états locaux pour gérer les entrées de l'utilisateur
  const [pseudo, setPseudo] = useState(''); // Pseudo de l'utilisateur
  const [email, setEmail] = useState(''); // Email de l'utilisateur
  const [motdepasse, setMotdepasse] = useState(''); // Mot de passe de l'utilisateur
  const [showPassword, setShowPassword] = useState(false); // Gère la visibilité du mot de passe
  const navigate = useNavigate(); // Hook pour la navigation entre les pages

  // Fonction pour gérer l'envoi du formulaire d'inscription
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de l'envoi du formulaire

    // Vérification que tous les champs sont remplis
    if (!pseudo || !email || !motdepasse) {
      alert('Tous les champs doivent être remplis.'); // Affiche un message si un champ est manquant
      return;
    }

    try {
      // Envoi des données d'inscription au serveur via une requête POST
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST', // Méthode HTTP pour envoyer les données
        headers: { 'Content-Type': 'application/json' }, // Indication que les données envoyées sont au format JSON
        body: JSON.stringify({
          username: pseudo.trim(), // Suppression des espaces en trop autour du pseudo
          email: email.trim(), // Suppression des espaces en trop autour de l'email
          motdepasse: motdepasse.trim(), // Suppression des espaces en trop autour du mot de passe
        }),
      });

      const data = await response.json(); // Parse la réponse du serveur en JSON

      // Vérification de la réussite de la requête
      if (response.ok) {
        alert('Inscription réussie.'); // Message de succès
        setPseudo(''); // Réinitialise le champ pseudo
        setEmail(''); // Réinitialise le champ email
        setMotdepasse(''); // Réinitialise le champ mot de passe
        navigate('/'); // Redirige l'utilisateur vers la page d'accueil
      } else {
        alert(`Erreur : ${data.message}`); // Affiche l'erreur retournée par le serveur
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error); // Affiche l'erreur en cas de problème de connexion
      alert('Erreur interne du serveur.'); // Message d'erreur générique
    }
  };

  // Fonction pour revenir à la page d'accueil
  const goHome = () => {
    navigate('/'); // Redirige l'utilisateur vers la page d'accueil
  };

  return (
    <div className="signup-container">
      {/* Bouton pour revenir à l'accueil */}
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        {/* Champ pour le pseudo */}
        <div className="form-group">
          <label htmlFor="Pseudo">Pseudo :</label>
          <input
            type="text" // Type de champ texte pour le pseudo
            id="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)} // Met à jour l'état du pseudo lors de la saisie
            required // Champ requis
            className="signup-input"
          />
        </div>
        
        {/* Champ pour l'email */}
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email" // Type de champ email
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Met à jour l'état de l'email lors de la saisie
            required // Champ requis
            className="signup-input"
          />
        </div>

        {/* Champ pour le mot de passe */}
        <div className="form-group">
          <label htmlFor="motdepasse">Mot de passe :</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} // Permet de basculer entre mot de passe masqué ou visible
              id="motdepasse"
              value={motdepasse}
              onChange={(e) => setMotdepasse(e.target.value)} // Met à jour l'état du mot de passe lors de la saisie
              required // Champ requis
              className="signup-input"
            />
            {/* Bouton pour afficher ou masquer le mot de passe */}
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)} // Inverse l'état de visibilité du mot de passe
            >
              {showPassword ? '👁️' : '👁️‍🗨️'} {/* Affiche l'icône appropriée selon l'état de visibilité */}
            </button>
          </div>
        </div>

        {/* Bouton pour soumettre le formulaire */}
        <button type="submit" className="save-button">S&apos;inscrire</button>
      </form>
    </div>
  );
};

export default SignUp;
