import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaUser, FaEdit, FaClipboardList, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/my-orders');
        setOrders(res.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setEditMode(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'confirmed':
      case 'preparing':
        return <FaClipboardList className="status-icon processing" />;
      case 'out_for_delivery':
        return <FaShoppingBag className="status-icon delivering" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      preparing: 'badge-primary',
      out_for_delivery: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return classes[status] || 'badge-warning';
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h1>Welcome, {user?.name?.split(' ')[0]}!</h1>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> My Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <h2>Order History</h2>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <FaShoppingBag className="empty-icon" />
                <h3>No orders yet</h3>
                <p>Looks like you haven't placed any orders yet. Start ordering delicious food!</p>
                <Link to="/menu" className="btn btn-primary">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <Link to={`/orders/${order.id}`} key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Order #{order.id}</span>
                      <span className={`badge ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="order-details">
                      <div className="order-info">
                        <span>{order.item_count} {order.item_count === 1 ? 'item' : 'items'}</span>
                        <span>•</span>
                        <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                      </div>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="dashboard-content">
            <div className="profile-header">
              <h2>Profile Settings</h2>
              <button 
                className="btn btn-outline"
                onClick={() => setEditMode(!editMode)}
              >
                <FaEdit /> {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form className="profile-form" onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Add phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  name="address"
                  className="form-input form-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Add delivery address"
                />
              </div>

              {editMode && (
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;