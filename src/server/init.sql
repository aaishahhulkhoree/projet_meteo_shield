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
    alert_type TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table villes_favorites
CREATE TABLE IF NOT EXISTS villes_favorites (
    id_ville_favorite SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs(id_utilisateur) ON DELETE CASCADE,
    villes TEXT[] NOT NULL
);

-- Create table weather_logs 
CREATE TABLE IF NOT EXISTS weather_logs (
    id_log SERIAL PRIMARY KEY,
    id_ville_favorite INTEGER REFERENCES villes_favorites(id_ville_favorite) ON DELETE CASCADE,
    city_name TEXT NOT NULL,
    jour DATE NOT NULL,
    temperature REAL NOT NULL,
    detail TEXT NOT NULL
);

CREATE UNIQUE INDEX unique_weather_logs ON weather_logs (city_name, jour);


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