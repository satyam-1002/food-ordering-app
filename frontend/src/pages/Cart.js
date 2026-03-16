import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, itemCount, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (foodItemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(foodItemId);
    } else {
      await updateQuantity(foodItemId, newQuantity);
    }
  };

  const deliveryFee = cartTotal > 0 && cartTotal < 500 ? 40 : 0;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + deliveryFee + tax;

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-icon" />
            <h2>Your cart is waiting</h2>
            <p>Please login to view your cart and start ordering</p>
            <Link to="/login" className="btn btn-primary btn-lg">
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} 
                    alt={item.name} 
                  />
                </div>
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-control">
                      <button 
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.food_id, item.quantity - 1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.food_id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.food_id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="free-delivery-note">
                Add ₹{(500 - cartTotal).toFixed(2)} more for FREE delivery
              </p>
            )}
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-full btn-lg checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FaArrowRight />
            </button>
            
            <Link to="/menu" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;