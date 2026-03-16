const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await FoodItem.getAll();
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Get food items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching food items',
      error: error.message
    });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await FoodItem.getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Get food items by category
router.get('/category/:category', async (req, res) => {
  try {
    const foods = await FoodItem.getByCategory(req.params.category);
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Get food by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching food items by category',
      error: error.message
    });
  }
});

// Get single food item
router.get('/:id', async (req, res) => {
  try {
    const food = await FoodItem.getById(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Get food item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching food item',
      error: error.message
    });
  }
});

// Search food items
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const foods = await FoodItem.search(q);
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Search food items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching food items',
      error: error.message
    });
  }
});

module.exports = router;