import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import FoodCard from '../components/food/FoodCard';
import './Menu.css';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/food/categories');
        setCategories(res.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedCategory && selectedCategory !== 'all') {
          res = await axios.get(`/api/food/category/${selectedCategory}`);
        } else {
          res = await axios.get('/api/food');
        }
        setFoods(res.data.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [selectedCategory]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.get(`/api/food/search?q=${encodeURIComponent(searchQuery)}`);
      setFoods(res.data.data);
      setSelectedCategory('all');
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchParams({});
  };

  return (
    <div className="menu-page">
      <div className="container">
        {/* Header */}
        <div className="menu-header">
          <div>
            <h1 className="page-title">Our Menu</h1>
            <p className="page-subtitle">Explore our delicious collection of dishes</p>
          </div>
          
          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={clearSearch}>
                <FaTimes />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Filter Toggle */}
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button>

        {/* Categories Filter */}
        <div className={`categories-filter ${showFilters ? 'show' : ''}`}>
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Foods Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : foods.length === 0 ? (
          <div className="empty-state">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" alt="No food found" />
            <h3>No dishes found</h3>
            <p>Try searching for something else or browse all categories</p>
            <button className="btn btn-primary" onClick={() => handleCategoryChange('all')}>
              View All Items
            </button>
          </div>
        ) : (
          <div className="foods-grid">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && foods.length > 0 && (
          <p className="results-count">
            Showing {foods.length} {foods.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;