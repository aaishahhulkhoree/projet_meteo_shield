const fs = require('fs');
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configurer PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'weather_data',
  password: 'boubou14',
  port: 5432,
});

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  try {
      const result = await pool.query(`
          SELECT to_regclass('public.utilisateurs') AS table_exists;
      `);
      if (result.rows[0].table_exists === null) {
          const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
          await pool.query(initSql);
          console.log('Base de données initialisée avec succès');
      } else {
          console.log('Base de données déjà initialisée.');
      }
  } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données :', err);
  }
};

// Appeler la fonction d'initialisation
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Route pour enregistrer les données météo
app.post('/api/weather', async (req, res) => {
  const { city_name, temperature, description } = req.body;
  const query = 'INSERT INTO weather_logs (city_name, temperature, description) VALUES ($1, $2, $3)';
  try {
    await pool.query(query, [city_name, temperature, description]);
    res.status(201).send('Data saved');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Route pour récupérer les données météo
app.get('/api/weather', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weather_logs ORDER BY timestamp DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// Route pour l'inscription
app.post('/api/signup', async (req, res) => {
  const { username, email, motdepasse } = req.body;

  if (!username || !email || !motdepasse) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse.trim(), 10);

    const result = await pool.query(
      'INSERT INTO utilisateurs (username, email, motdepasse) VALUES ($1, $2, $3) RETURNING id_utilisateur',
      [username.trim(), email.trim(), hashedPassword]
    );

    res.status(201).json({ message: 'Utilisateur créé avec succès.', userId: result.rows[0].id_utilisateur });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error.message);
    if (error.code === '23505') {
      res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    } else {
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }
});

// Route pour la connexion
app.post('/api/login', async (req, res) => {
  const { email, motdepasse } = req.body;

  if (!email || !motdepasse) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email.trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email non trouvé.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);

    if (isMatch) {
      res.status(200).json({
        message: 'Connexion réussie.',
        username: user.username, // Inclure le pseudo dans la réponse
      });
    } else {
      res.status(401).json({ message: 'Mot de passe incorrect.' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});