import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signup.css';

const SignUp = () => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pseudo || !email || !motdepasse) {
      alert('Tous les champs doivent être remplis.');
      return;
    }

    try {
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
        navigate('/');
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Erreur interne du serveur.');
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
          <label htmlFor="Pseudo">Pseudo :</label>
          <input
            type="Pseudo"
            id="Pseudo"
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
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />
        </div>
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
        <button type="submit" className="save-button">S&apos;inscrire</button>
      </form>
    </div>
  );
};

export default SignUp;
