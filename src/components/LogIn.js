import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/login.css'; // Ajouter le style pour la page de connexion

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      // Ajouter la logique de connexion ici (API, vérification, etc.)
      console.log("Connexion réussie avec l'email :", email);
      alert('Connexion réussie !');
      // Rediriger vers la page d'accueil ou autre
      navigate('/');
    } else {
      alert("Veuillez remplir tous les champs !");
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    
    <div className="login-container">
      {/* Bouton retour à l'accueil */}
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
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button className="save-button">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
