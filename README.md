# MeteoShield - Extreme Weather Alert Web Application

This project, **MeteoShield**, is a web application designed to provide real-time updates and alerts for extreme weather events. The application ensures user safety by offering accurate forecasts, interactive maps, and customizable notifications.

## Features
- **Real-Time Alerts**: Notifications for extreme weather events such as storms, floods, heatwaves, and more.
- **Interactive Map**: GeoJSON-powered map displaying danger zones (in red) and safe zones (in green).
- **Customizable Notifications**: Users can personalize alerts based on location and preferred event types.
- **Hourly and Weekly Forecasts**: Comprehensive weather updates for better planning.

## Getting Started
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/meteoshield.git
   ```
2. Navigate to the project directory:
   ```bash
   cd meteoshield
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn add
   ```

### Configuration
1. Create a `.env` file in the root directory.
2. Add your OpenWeather API key:
   ```env
   REACT_APP_OPENWEATHER_API_KEY=fd441e159a57c88c956ebf246cc1ae9c
   ```

### Running the Application
To start the application in development mode:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
The build files will be available in the `build` folder.

### Running Tests
To run the test suite:
```bash
npm test
```

## Deployment
For deployment instructions, refer to the [Create React App Deployment Guide](https://facebook.github.io/create-react-app/docs/deployment).

## Technologies Used
- **React**: Frontend framework
- **GeoJSON**: Interactive map rendering
- **OpenWeather API**: Weather data provider
- **HTML/CSS/JavaScript**: Core web technologies

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments
- [OpenWeather](https://openweathermap.org/) for providing the API.
- All contributors and developers who made this project possible.

## Contact
For inquiries or support, please contact:
- **Name**: Cortial (Jade) & Hulkhoree (Aaishah)
- **Email**: jade.cortial@etu.u-paris.fr & aaishah.hulkhoree@etu.u-paris.fr

Enjoy using **MeteoShield**, your trusted extreme weather companion!

