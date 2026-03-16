import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaDollarSign, FaUsers, FaUtensils, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    delivered_orders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('/api/admin/orders/stats'),
          axios.get('/api/admin/orders?limit=5')
        ]);
        
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: <FaShoppingBag />,
      color: '#3498db'
    },
    {
      title: 'Total Revenue',
      value: `₹${parseFloat(stats.total_revenue || 0).toFixed(2)}`,
      icon: <FaDollarSign />,
      color: '#00b894'
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders,
      icon: <FaArrowUp />,
      color: '#e17055'
    },
    {
      title: 'Delivered Orders',
      value: stats.delivered_orders,
      icon: <FaArrowDown />,
      color: '#9b59b6'
    }
  ];

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
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome to the admin panel</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/foods" className="action-card">
              <FaUtensils className="action-icon" />
              <span>Manage Foods</span>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <FaShoppingBag className="action-icon" />
              <span>Manage Orders</span>
            </Link>
            <Link to="/menu" className="action-card">
              <FaUsers className="action-icon" />
              <span>View Menu</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all">View All</Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user_name}</td>
                      <td>{order.item_count} items</td>
                      <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;