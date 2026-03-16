const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// ============ FOOD ITEMS MANAGEMENT ============

// Get all food items (including unavailable)
router.get('/foods', async (req, res) => {
  try {
    const [rows] = await require('../config/database').query(
      'SELECT * FROM food_items ORDER BY category, name'
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Get all food items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching food items',
      error: error.message
    });
  }
});

// Create new food item
router.post('/foods', async (req, res) => {
  try {
    const { name, description, price, category, image_url, preparation_time, is_available } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, and category'
      });
    }

    const foodId = await FoodItem.create({
      name,
      description,
      price,
      category,
      image_url,
      preparation_time,
      is_available
    });

    const food = await FoodItem.getById(foodId);

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: food
    });
  } catch (error) {
    console.error('Create food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating food item',
      error: error.message
    });
  }
});

// Update food item
router.put('/foods/:id', async (req, res) => {
  try {
    const { name, description, price, category, image_url, preparation_time, is_available } = req.body;

    const existingFood = await FoodItem.getById(req.params.id);
    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    await FoodItem.update(req.params.id, {
      name: name || existingFood.name,
      description: description !== undefined ? description : existingFood.description,
      price: price || existingFood.price,
      category: category || existingFood.category,
      image_url: image_url !== undefined ? image_url : existingFood.image_url,
      preparation_time: preparation_time !== undefined ? preparation_time : existingFood.preparation_time,
      is_available: is_available !== undefined ? is_available : existingFood.is_available
    });

    const food = await FoodItem.getById(req.params.id);

    res.json({
      success: true,
      message: 'Food item updated successfully',
      data: food
    });
  } catch (error) {
    console.error('Update food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating food item',
      error: error.message
    });
  }
});

// Delete food item
router.delete('/foods/:id', async (req, res) => {
  try {
    const deleted = await FoodItem.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Delete food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting food item',
      error: error.message
    });
  }
});

// ============ ORDERS MANAGEMENT ============

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    
    let orders;
    if (status) {
      orders = await Order.getByStatus(status);
    } else {
      orders = await Order.getAll(
        parseInt(limit) || 50,
        parseInt(offset) || 0
      );
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await Order.updateStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Get order statistics
router.get('/orders/stats', async (req, res) => {
  try {
    const stats = await Order.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
});

// ============ USERS MANAGEMENT ============

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.getAll();

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

module.exports = router;