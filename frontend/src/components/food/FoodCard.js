import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaClock } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './FoodCard.css';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(food.id);
  };

  return (
    <div className="food-card">
      <div className="food-image">
        <img src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={food.name} />
        <span className="food-category">{food.category}</span>
      </div>
      <div className="food-content">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-description">{food.description}</p>
        <div className="food-meta">
          <span className="food-price">₹{food.price}</span>
          <span className="food-time">
            <FaClock /> {food.preparation_time} mins
          </span>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleAddToCart}>
          <FaPlus /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;