import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signup.css'; // Style pour la page d'inscription

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Exemple de logique pour créer un compte (backend non connecté)
    if (pseudo && email && password) {
      console.log('Compte créé avec : ', { pseudo, email, password });
      alert('Inscription réussie !');
      navigate('/'); // Rediriger vers la page Home
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

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
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo :</label>
          <input
            type="pseudo"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
            className="signup-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
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
            className="signup-input"
          />
        </div>
        <button type="submit" className="save-button">
          S&apos;inscrire
        </button>
      </form>
    </div>
  );
};

export default SignUp;
