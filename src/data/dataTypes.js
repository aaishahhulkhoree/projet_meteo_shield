//Données météo actuelles
export const WeatherDataType = {
    temperature: 0.0,           // Nombre (float)
    humidity: 0,                // Nombre (int)
    pressure: 0.0,              // Nombre (float)
    windSpeed: 0.0,             // Nombre (float)
    windDirection: '',          // Chaîne de caractères
    weatherDescription: '',     // Chaîne de caractères
    weatherCode: 0              // Code météo (int)
  };
  
  //Prévisions météo (horaire ou quotidienne)
  export const ForecastDataType = {
    dateTime: '',               // Chaîne de caractères 
    temperature: 0.0,           // Nombre (float)
    weatherType: '',            // Chaîne de caractères (description)
    willRain: false,            // Booléen (true ou false)
    windSpeed: 0.0              // Nombre (float)
  };
  
  //Alerte météo
  export const WeatherAlertType = {
    type: '',                   // Type d'alerte (tempête, canicule, etc.)
    severity: 0,                // Gravité (int, de 1 à 4)
    description: '',            // Description de l'alerte
    startTime: '',              // Début de l'alerte 
    endTime: '',                // Fin de l'alerte
    affectedZones: []           // Tableau des zones touchées (villes)
  };
  
  //Localisation utilisateur
  export const UserLocationType = {
    latitude: 0.0,              // Coordonnée (latitude)
    longitude: 0.0,             // Coordonnée (longitude)
    cityName: '',               // Nom de la ville
    country: '',                // Pays
    postalCode: '',             // Code postal
    timeZone: ''                // Fuseau horaire
  };
  
  //Données utilisateur
  export const UserDataType = {
    username: '',               // Nom d'utilisateur
    email: '',                  // Email de l'utilisateur
    alertPreferences: [],       // Préférences d'alerte (liste)
    unit: 'Celsius',            // Unité de température (Celsius / Fahrenheit)
    displayMode: 'Mode Jour',   // Mode d'affichage (Jour / Nuit)
    savedLocations: []          // Villes sauvegardées
  };
  