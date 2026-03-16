import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <FaUtensils className="logo-icon" />
          <span>FoodHub</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/menu" className="nav-link" onClick={closeMenu}>
            Menu
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
                <FaShoppingCart />
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              
              <div className="nav-dropdown">
                <button className="dropdown-toggle">
                  <FaUser />
                  <span>{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/dashboard" onClick={closeMenu}>
                    <FaTachometerAlt /> Dashboard
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" onClick={closeMenu}>
                      <FaUtensils /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;