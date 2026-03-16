import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    preparation_time: '',
    is_available: true
  });

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('/api/admin/foods');
      setFoods(res.data.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/food/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      preparation_time: '',
      is_available: true
    });
    setEditingFood(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description || '',
      price: food.price,
      category: food.category,
      image_url: food.image_url || '',
      preparation_time: food.preparation_time || '',
      is_available: food.is_available
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFood) {
        await axios.put(`/api/admin/foods/${editingFood.id}`, formData);
        toast.success('Food item updated successfully');
      } else {
        await axios.post('/api/admin/foods', formData);
        toast.success('Food item added successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchFoods();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/foods/${foodId}`);
      toast.success('Food item deleted successfully');
      fetchFoods();
    } catch (error) {
      toast.error('Failed to delete food item');
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Manage Food Items</h1>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FaPlus /> Add New Item
          </button>
        </div>

        {/* Search */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Foods Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Prep Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food.id}>
                    <td>
                      <img 
                        src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} 
                        alt={food.name} 
                        className="table-img"
                      />
                    </td>
                    <td>{food.name}</td>
                    <td>{food.category}</td>
                    <td>₹{food.price}</td>
                    <td>{food.preparation_time} mins</td>
                    <td>
                      <span className={`badge ${food.is_available ? 'badge-success' : 'badge-danger'}`}>
                        {food.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit"
                          onClick={() => openEditModal(food)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={() => handleDelete(food.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price *</label>
                    <input
                      type="number"
                      name="price"
                      className="form-input"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      className="form-input form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-input form-textarea"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    className="form-input"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prep Time (mins)</label>
                    <input
                      type="number"
                      name="preparation_time"
                      className="form-input"
                      value={formData.preparation_time}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label checkbox-label">
                      <input
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                      />
                      <span>Available for ordering</span>
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingFood ? 'Update' : 'Add'} Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFoods;