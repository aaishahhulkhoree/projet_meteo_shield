import React from 'react';
import './App.css';
import './assets/styles/global.css';
import './assets/styles/home.css';
import './assets/styles/about.css';
import './assets/styles/modal.css';
import Home from './components/Home';
import About from './components/About';
import Modal from './components/Modal';
import Forecast from './components/Forecast';
import Map from './components/Map';
//import Login from './components/LogIn';
//import SignUp from './components/SignUp';
import Settings from './components/Settings';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/map" element={<Map />} />
          <Route path="/modal" element={<Modal />} />

        </Routes>
    </div>
    </Router>

  );
}

export default App;
