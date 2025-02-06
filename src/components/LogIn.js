import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/login.css';

/**
 * Composant Login permettant aux utilisateurs de se connecter à l'application.
 */
const Login = () => {
  // États pour gérer l'email, le mot de passe et la visibilité du mot de passe
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
  const navigate = useNavigate();

  /**
   * Gère la soumission du formulaire de connexion.
   * Vérifie que tous les champs sont remplis, envoie les données au serveur et stocke les informations de l'utilisateur si la connexion réussit.
   * @param {Event} event - L'événement de soumission du formulaire.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérifie que l'email et le mot de passe sont bien renseignés
    if (!email || !motdepasse) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // Envoi des informations de connexion au serveur
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), motdepasse: motdepasse.trim() }),
      });

      // Vérifie si la connexion est réussie
      if (response.ok) {
        const data = await response.json();
        console.log('Données de connexion reçues :', data); // Ajoutez cette ligne
        alert('Connexion réussie !');

        // Stocke l'ID utilisateur et le nom d'utilisateur dans le localStorage
        localStorage.setItem('userId', data.userId); //Stocke de l'id localement
        localStorage.setItem('username', data.username); //Stocke du pseudo localement

        // Réinitialise les champs du formulaire
        setEmail('');
        setMotdepasse('');
        navigate('/');
      } else {
        // Affiche l'erreur retournée par le serveur
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert('Impossible de se connecter. Veuillez réessayer.');
    }
  };

  /**
   * Redirige l'utilisateur vers la page d'accueil.
   */
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <button className="home-btn" onClick={goHome}>
        <span>Retour à l&apos;accueil</span>
      </button>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="motdepasse">Mot de passe :</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} // Bascule entre texte et mot de passe
              id="motdepasse"
              value={motdepasse}
              onChange={(e) => setMotdepasse(e.target.value)}
              required
              className="login-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'} {/* Icône pour afficher/masquer */}
            </button>
          </div>
        </div>
        <button type="submit" className="save-button">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
