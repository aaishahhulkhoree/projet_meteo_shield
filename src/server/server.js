const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 5000;

// Configurer la connexion à la base de données PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect();

app.use(express.json());

// Route pour enregistrer les données météo
app.post('/api/weather', async (req, res) => {
  const { city_name, temperature, description } = req.body;
  const query = 'INSERT INTO weather_logs (city_name, temperature, description) VALUES ($1, $2, $3)';
  try {
    await client.query(query, [city_name, temperature, description]);
    res.status(201).send('Data saved');
  } catch (error) {
    res.status(500).send('Error saving data');
  }
});

// Route pour récupérer les données météo
app.get('/api/weather', (req, res) => {
  client.query('SELECT * FROM weather_logs ORDER BY timestamp DESC LIMIT 10', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching data');
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
