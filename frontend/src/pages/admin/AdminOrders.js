import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${statusFilter}`;
      const res = await axios.get(url);
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
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
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Orders</h1>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              className="form-input form-select filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders found</h3>
            <p>There are no orders matching your filter criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.user_name}</span>
                        <span className="customer-email">{order.user_email}</span>
                      </div>
                    </td>
                    <td>{order.item_count} items</td>
                    <td>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td>{order.payment_method?.toUpperCase()}</td>
                    <td>
                      <select
                        className={`status-select ${getStatusClass(order.status)}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-icon view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order #{selectedOrder.id} Details</h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.user_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user_email}</p>
                </div>

                <div className="order-detail-section">
                  <h4>Delivery Information</h4>
                  <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                  <p><strong>Payment:</strong> {selectedOrder.payment_method?.toUpperCase()}</p>
                  {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
                </div>

                <div className="order-detail-section">
                  <h4>Order Summary</h4>
                  <p><strong>Total:</strong> ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</p>
                  <p><strong>Status:</strong> <span className={`badge ${getStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                </div>

                <div className="order-detail-actions">
                  <select
                    className="form-input form-select"
                    value={selectedOrder.status}
                    onChange={(e) => {
                      handleStatusChange(selectedOrder.id, e.target.value);
                      setSelectedOrder({...selectedOrder, status: e.target.value});
                    }}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;