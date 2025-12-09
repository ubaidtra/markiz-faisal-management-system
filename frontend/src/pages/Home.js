import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-nav-container">
          <div className="home-logo">
            <img src="/logo.jpg" alt="Faisal Center Logo" className="home-logo-img" />
            <span>Faisal Qura'anic Memorization Center</span>
          </div>
          <Link to="/login" className="sign-in-btn">Sign In</Link>
        </div>
      </nav>
      <div className="home-content">
        <div className="banner-section">
          <img src="/banner.jpg" alt="Banner" className="banner-image" />
        </div>
        <div className="about-section">
          <h1>About Our Center</h1>
          <p>
            Welcome to Faisal, His Parents and Family's Qura'anic Memorization Center. 
            We are dedicated to providing quality Islamic education and helping students 
            memorize the Holy Quran with proper Tajweed and understanding.
          </p>
          <p>
            Our center is located in Sotokou Layout - Allatentu, Kombo North District, 
            The Gambia, West Africa. We serve our community with excellence and commitment 
            to preserving the teachings of the Quran.
          </p>
          <div className="home-actions">
            <Link to="/login" className="cta-button">Access Management System</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

