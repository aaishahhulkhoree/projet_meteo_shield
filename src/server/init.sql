-- Drop tables if they exist
DROP TABLE IF EXISTS weather_logs CASCADE;
DROP TABLE IF EXISTS preferences_utilisateur CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Create table utilisateurs
CREATE TABLE utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    motdepasse VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table preferences_utilisateur
CREATE TABLE preferences_utilisateur (
    id_preference SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE,
    temperature_unit VARCHAR(10) DEFAULT 'C',
    geolocation_enabled BOOLEAN DEFAULT TRUE,
    alert_type TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table weather_logs
CREATE TABLE weather_logs (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    temperature NUMERIC NOT NULL,
    description VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);