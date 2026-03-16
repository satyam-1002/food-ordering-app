const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartItems = await Cart.getByUserId(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);
    const count = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      data: cartItems,
      total: parseFloat(total),
      itemCount: parseInt(count)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { food_item_id, quantity } = req.body;

    if (!food_item_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food_item_id'
      });
    }

    await Cart.addItem(req.user.id, food_item_id, quantity || 1);

    const cartItems = await Cart.getByUserId(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);
    const count = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cartItems,
      total: parseFloat(total),
      itemCount: parseInt(count)
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { food_item_id, quantity } = req.body;

    if (!food_item_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food_item_id and quantity'
      });
    }

    await Cart.updateQuantity(req.user.id, food_item_id, parseInt(quantity));

    const cartItems = await Cart.getByUserId(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);
    const count = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      message: 'Cart updated',
      data: cartItems,
      total: parseFloat(total),
      itemCount: parseInt(count)
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:food_item_id', verifyToken, async (req, res) => {
  try {
    await Cart.removeItem(req.user.id, req.params.food_item_id);

    const cartItems = await Cart.getByUserId(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);
    const count = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cartItems,
      total: parseFloat(total),
      itemCount: parseInt(count)
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await Cart.clearCart(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared',
      data: [],
      total: 0,
      itemCount: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

// Get cart count
router.get('/count', verifyToken, async (req, res) => {
  try {
    const count = await Cart.getCartCount(req.user.id);

    res.json({
      success: true,
      count: parseInt(count)
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart count',
      error: error.message
    });
  }
});

module.exports = router;