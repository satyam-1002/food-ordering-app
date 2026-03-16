import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaTimes, FaClipboardList, FaMotorcycle } from 'react-icons/fa';
import axios from 'axios';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    return steps.indexOf(status);
  };

  const getStatusInfo = (status) => {
    const info = {
      pending: { icon: <FaClock />, text: 'Order Placed', color: '#e17055' },
      confirmed: { icon: <FaCheckCircle />, text: 'Confirmed', color: '#3498db' },
      preparing: { icon: <FaClipboardList />, text: 'Preparing', color: '#f39c12' },
      out_for_delivery: { icon: <FaMotorcycle />, text: 'Out for Delivery', color: '#9b59b6' },
      delivered: { icon: <FaCheckCircle />, text: 'Delivered', color: '#00b894' },
      cancelled: { icon: <FaTimes />, text: 'Cancelled', color: '#e74c3c' }
    };
    return info[status] || info.pending;
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="not-found">
            <h2>Order Not Found</h2>
            <p>The order you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const currentStep = getStatusStep(order.status);

  return (
    <div className="order-details-page">
      <div className="container">
        <Link to="/dashboard" className="back-btn">
          <FaArrowLeft /> Back to Orders
        </Link>

        <div className="order-header">
          <div>
            <h1>Order #{order.id}</h1>
            <p className="order-date">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="status-badge" style={{ backgroundColor: statusInfo.color }}>
            {statusInfo.icon}
            <span>{order.status.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Order Progress */}
        {order.status !== 'cancelled' && (
          <div className="order-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {['Placed', 'Confirmed', 'Preparing', 'On the way', 'Delivered'].map((step, index) => (
                <div 
                  key={step} 
                  className={`progress-step ${index <= currentStep ? 'active' : ''}`}
                >
                  <div className="step-dot"></div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-content">
          {/* Order Items */}
          <div className="order-items-card">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} 
                    alt={item.name} 
                    className="item-image"
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.quantity} x ₹{item.price}</p>
                  </div>
                  <div className="item-total">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>Included</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="order-info-card">
            <h3>Order Information</h3>
            
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Delivery Address</h4>
                <p>{order.delivery_address}</p>
              </div>
            </div>

            <div className="info-item">
              <FaCreditCard className="info-icon" />
              <div>
                <h4>Payment Method</h4>
                <p>{order.payment_method.toUpperCase()}</p>
              </div>
            </div>

            {order.notes && (
              <div className="info-item">
                <FaClipboardList className="info-icon" />
                <div>
                  <h4>Order Notes</h4>
                  <p>{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;