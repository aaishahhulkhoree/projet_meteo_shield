import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !motdepasse) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), motdepasse: motdepasse.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Données de connexion reçues :', data); // Ajoutez cette ligne
        alert('Connexion réussie !');
        localStorage.setItem('userId', data.userId); //Stocke de l'id localement
        localStorage.setItem('username', data.username); //Stocke du pseudo localement
        setEmail('');
        setMotdepasse('');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert('Impossible de se connecter. Veuillez réessayer.');
    }
  };

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
