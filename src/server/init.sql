-- Create table utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    motdepasse VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table preferences_utilisateur
CREATE TABLE IF NOT EXISTS preferences_utilisateur (
    id_preference SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE,
    temperature_unit VARCHAR(10) DEFAULT 'C',
    geolocation_enabled BOOLEAN DEFAULT TRUE,
    alert_type TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table weather_logs
CREATE TABLE IF NOT EXISTS weather_logs (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    temperature NUMERIC NOT NULL,
    description VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create or replace function set_updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for preferences_utilisateur
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_preferences_updated_at'
    ) THEN
        CREATE TRIGGER update_preferences_updated_at
        BEFORE UPDATE ON preferences_utilisateur
        FOR EACH ROW
        EXECUTE PROCEDURE set_updated_at();
    END IF;
END;
$$;