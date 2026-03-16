import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaTruck, FaClock, FaShieldAlt, FaArrowRight, FaPlay } from 'react-icons/fa';
import axios from 'axios';
import FoodCard from '../components/food/FoodCard';
import './Home.css';

const Home = () => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, categoriesRes] = await Promise.all([
          axios.get('/api/food'),
          axios.get('/api/food/categories')
        ]);
        
        setFeaturedFoods(foodsRes.data.data.slice(0, 8));
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food Delivered To Your Door</h1>
          <p>Order from your favorite restaurants and get it delivered hot & fresh in minutes.</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary btn-lg">
              Order Now <FaArrowRight />
            </Link>
            <button className="btn btn-outline btn-lg">
              <FaPlay /> Watch Video
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Food Items</span>
            </div>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Delivery Partners</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600" alt="Delicious Food" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaUtensils />
              </div>
              <h3>Quality Food</h3>
              <p>We partner with the best restaurants to bring you high-quality, delicious meals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <h3>Fast Delivery</h3>
              <p>Get your food delivered in 30 minutes or less with our express delivery service.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>Easy Ordering</h3>
              <p>Simple and intuitive ordering process. Order in just a few taps!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Safe & Secure</h3>
              <p>Your payments and data are protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories section">
        <div className="container">
          <h2 className="section-title text-center">Browse Categories</h2>
          <p className="section-subtitle text-center">Explore our wide range of cuisines</p>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/menu?category=${category}`} 
                className="category-card"
              >
                <div className="category-icon">
                  <FaUtensils />
                </div>
                <span>{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Foods Section */}
      <section className="featured-foods section">
        <div className="container">
          <h2 className="section-title">Featured Items</h2>
          <p className="section-subtitle">Most popular dishes loved by our customers</p>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="foods-grid">
              {featuredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
          
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link to="/menu" className="btn btn-primary btn-lg">
              View Full Menu <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Order?</h2>
            <p>Download our app or order online and get exclusive discounts!</p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              Start Ordering <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;