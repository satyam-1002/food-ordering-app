const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { delivery_address, payment_method, notes } = req.body;

    // Get cart items
    const cartItems = await Cart.getByUserId(req.user.id);
    
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    if (!delivery_address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide delivery address'
      });
    }

    // Calculate total
    const total = await Cart.getCartTotal(req.user.id);

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      food_item_id: item.food_id,
      quantity: item.quantity,
      price: item.price
    }));

    // Create order
    const orderId = await Order.create({
      user_id: req.user.id,
      total_amount: total,
      delivery_address,
      payment_method: payment_method || 'cash',
      notes
    }, orderItems);

    // Clear cart
    await Cart.clearCart(req.user.id);

    // Get order details
    const order = await Order.getById(orderId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get user's orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.getByUserId(req.user.id);

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

// Get single order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Cancel order
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already ' + order.status
      });
    }

    await Order.updateStatus(req.params.id, 'cancelled');

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

module.exports = router;