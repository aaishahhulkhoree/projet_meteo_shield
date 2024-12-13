// src/utils/PrevisionMeteo.js

class PrevisionMeteo {
    static instance = null;

    constructor() {
      if (PrevisionMeteo.instance) {
        return PrevisionMeteo.instance;
      }
      this.forecastData = null; // Stockage des prévisions
      this.observers = []; // Liste des observateurs
      PrevisionMeteo.instance = this;
    }

    ajouterObserver(observer) {
      this.observers.push(observer);
    }

    retirerObserver(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifierObservers() {
      this.observers.forEach(observer => observer.mettreAJour(this.forecastData));
    }

    async mettreAJourPrevisions(city) {
        try {
            const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            const data = await response.json();

            if (data) {
                this.forecastData = data;
                this.notifierObservers(); // Notify observers only when data is valid
            } else {
                console.error('Forecast data is undefined or null');
            }
        } catch (error) {
            console.error('Error fetching forecast data:', error);
        }
    }

    async getCityName(latitude, longitude) {
        try {
          const API_KEY = 'fd441e159a57c88c956ebf246cc1ae9c';
          const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch city name');
          }
          const data = await response.json();
          return data[0]?.name || 'Unknown Location';
        } catch (error) {
          console.error('Error fetching city name:', error);
          throw error;
        }
      }
}

export default new PrevisionMeteo();
