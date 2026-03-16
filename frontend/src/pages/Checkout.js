import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaLock, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    payment_method: 'cash',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const deliveryFee = cartTotal > 0 && cartTotal < 500 ? 40 : 0;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + deliveryFee + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        delivery_address: formData.address,
        payment_method: formData.payment_method,
        notes: formData.notes
      };

      const res = await axios.post('/api/orders', orderData);
      
      if (res.data.success) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate(`/orders/${res.data.data.id}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="page-title">Checkout</h1>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Delivery Details */}
            <div className="delivery-section">
              <h3>Delivery Details</h3>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  name="address"
                  className="form-input form-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete delivery address"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  className="form-input form-textarea"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for your order..."
                />
              </div>

              {/* Payment Method */}
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <label className={`payment-option ${formData.payment_method === 'cash' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={formData.payment_method === 'cash'}
                    onChange={handleChange}
                  />
                  <FaMoneyBillWave className="payment-icon" />
                  <span>Cash on Delivery</span>
                </label>

                <label className={`payment-option ${formData.payment_method === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === 'card'}
                    onChange={handleChange}
                  />
                  <FaCreditCard className="payment-icon" />
                  <span>Credit/Debit Card</span>
                </label>

                <label className={`payment-option ${formData.payment_method === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="upi"
                    checked={formData.payment_method === 'upi'}
                    onChange={handleChange}
                  />
                  <FaMobileAlt className="payment-icon" />
                  <span>UPI Payment</span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.cart_id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full btn-lg place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <div className="secure-checkout">
                <FaLock />
                <span>Secure Checkout - Your data is protected</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;