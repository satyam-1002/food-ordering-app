import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaUtensils, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <FaUtensils className="footer-logo-icon" />
            <span>FoodHub</span>
          </div>
          <p className="footer-description">
            Your favorite food delivered hot & fresh. Order online and enjoy delicious meals from the comfort of your home.
          </p>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/dashboard">My Orders</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li><Link to="/menu?category=Burgers">Burgers</Link></li>
            <li><Link to="/menu?category=Pizza">Pizza</Link></li>
            <li><Link to="/menu?category=Biryani">Biryani</Link></li>
            <li><Link to="/menu?category=Chinese">Chinese</Link></li>
            <li><Link to="/menu?category=Desserts">Desserts</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt />
              <span>123 Food Street, Cuisine City</span>
            </li>
            <li>
              <FaPhone />
              <span>+1 234 567 890</span>
            </li>
            <li>
              <FaEnvelope />
              <span>support@foodhub.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FoodHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;