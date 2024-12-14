// src/utils/PrevisionMeteo.js

/**
 * Classe Singleton pour gerer les donnees meteo et notifier les observateurs lorsque les donnees changent.
 */

class PrevisionMeteo {
    static instance = null;

    constructor() {
      if (PrevisionMeteo.instance) {
        return PrevisionMeteo.instance; // Retourne l'instance existante si elle existe deja
      }
      this.forecastData = null; // Stockage des previsions
      this.observers = []; // Liste des observateurs
      PrevisionMeteo.instance = this; // Definit l'instance unique
    }
  
    /**
      * Ajouter un observateur pour recevoir des mises à jour.
      * @param {Object} observer - L'observateur avec une méthode `mettreAJour`
      */

    ajouterObserver(observer) {
      this.observers.push(observer);
    }

    /**
      * Retirer un observateur de la liste.
      * @param {Object} observer - L'observateur à retirer
      */

    retirerObserver(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }

    /**
      * Notifier tous les observateurs des nouvelles données.
      */

    notifierObservers() {
      this.observers.forEach(observer => observer.mettreAJour(this.forecastData));
    }

    /**
      * Récupérer les prévisions météo pour une ville et notifier les observateurs.
      * @param {string} city - Nom de la ville
      */

    async mettreAJourPrevisions(city) {
        try {
            const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Echec de la recuperation des donnees meteo');
            }
            const data = await response.json();

            if (data) {
                this.forecastData = data; // Met a jour les donnees des previsions
                this.notifierObservers(); // Notifie les observateurs
            } else {
                console.error('Les donnees meteo sont vides ou nulles');
            }
        } catch (error) {
            console.error('Erreur lors de la recuperation des previsions :', error);
        }
    }

    /**
      * Convertir des coordonnées géographiques en nom de ville.
      * @param {number} latitude - Latitude
      * @param {number} longitude - Longitude
      * @returns {Promise<string>} - Nom de la ville
      */
    async getCityName(latitude, longitude) {
        try {
          const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
          const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Echec de la recuperation du nom de la ville');
          }
          const data = await response.json();
          return data[0]?.name || 'Lieu inconnu'; // Retourne le nom de la ville ou un message par défaut
        } catch (error) {
          console.error('Erreur lors de la récupération du nom de la ville :', error);
          throw error;
        }
      }
}

export default new PrevisionMeteo();
