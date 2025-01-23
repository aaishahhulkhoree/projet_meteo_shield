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
  const query = 'INSERT INTO weather_logs (city_name, temperature, detail) VALUES ($1, $2, $3)';
  try {
    await pool.query(query, [city_name, temperature, detail]);
    res.status(201).send('Data saved');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Route pour récupérer les données météo
app.get('/api/weather', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weather_logs ORDER BY jour DESC LIMIT 10');
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
        userId: user.id_utilisateur,
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

// Route pour gérer les villes favorites
app.post('/api/villes-favorites', async (req, res) => {
  const { userId, villes } = req.body;

  console.log(`Requête reçue pour villes-favorites avec userId : ${userId} et villes :`, villes);

  if (!userId || !villes) {
    return res.status(400).json({ message: 'Utilisateur ou liste de villes manquante.' });
  }

  try {
    const checkExistenceQuery = 'SELECT id_ville_favorite FROM villes_favorites WHERE id_utilisateur = $1';
    const result = await pool.query(checkExistenceQuery, [userId]);

    if (result.rows.length > 0) {
      // Mettre à jour les villes même si la liste est vide
      const updateQuery = `
        UPDATE villes_favorites
        SET villes = $1
        WHERE id_utilisateur = $2
      `;
      await pool.query(updateQuery, [villes, userId]);
    } else {
      // Insérer une nouvelle ligne si elle n'existe pas
      const insertQuery = `
        INSERT INTO villes_favorites (id_utilisateur, villes)
        VALUES ($1, $2)
      `;
      await pool.query(insertQuery, [userId, villes]);
    }

    res.status(200).json({ message: 'Villes préférées mises à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la gestion des villes préférées :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour récupérer les villes favorites d'un utilisateur
app.get('/api/villes-favorites/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT villes FROM villes_favorites WHERE id_utilisateur = $1', [userId]);
    if (result.rows.length > 0) {
      res.status(200).json({ villes: result.rows[0].villes });
    } else {
      res.status(404).json({ villes: [] });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des villes favorites :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});


//Route pour l'historique des données météo
app.post('/api/weather-logs', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Utilisateur manquant.' });
  }

  try {
    // Récupérer les villes favorites actuelles
    const villesQuery = `
      SELECT villes FROM villes_favorites WHERE id_utilisateur = $1
    `;
    const villesResult = await pool.query(villesQuery, [userId]);

    if (villesResult.rows.length === 0) {
      // Si aucune ville favorite, supprimer les logs correspondants
      const deleteQuery = `
        DELETE FROM weather_logs WHERE id_ville_favorite = (
          SELECT id_ville_favorite FROM villes_favorites WHERE id_utilisateur = $1
        )
      `;
      await pool.query(deleteQuery, [userId]);
      return res.status(200).json({ message: 'Aucune ville favorite. Logs supprimés.' });
    }

    const villes = villesResult.rows[0].villes;

    for (const city of villes) {
      // Étape 1 : Obtenir les coordonnées de la ville via l'API de géocodage
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=214ead2b8884d5132939cc3cbae224c7`
      );
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        console.error(`Impossible de trouver les coordonnées pour la ville : ${city}`);
        continue;
      }

      const { lat, lon } = geoData[0];
      console.log(`Coordonnées pour ${city}: lat=${lat}, lon=${lon}`);

      // Étape 2 : Récupérer les données météo historiques pour les 5 derniers jours
      for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const timestamp = Math.floor(date.getTime() / 1000);

        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=214ead2b8884d5132939cc3cbae224c7&units=metric`
        );
        const weatherData = await weatherResponse.json();
        console.log(`Réponse API pour ${city} à la date ${date}:`, weatherData);

        if (weatherData.current) {
          const { temp, weather } = weatherData.current;
          const description = weather?.[0]?.description || 'Non spécifié';

          const upsertQuery = `
            INSERT INTO weather_logs (id_ville_favorite, city_name, jour, temperature, detail)
            VALUES (
              (SELECT id_ville_favorite FROM villes_favorites WHERE id_utilisateur = $1),
              $2, $3, $4, $5
            )
            ON CONFLICT (city_name, jour) DO NOTHING
          `;
          await pool.query(upsertQuery, [
            userId,
            city,
            date.toISOString().split('T')[0],
            temp,
            description,
          ]);
        } else {
          console.error(`Pas de données disponibles pour la ville ${city} à la date ${date}`);
        }
      }
    }

    res.status(200).json({ message: 'Historique des données météo mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données météo :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});