const db = require('../config/database');

class Cart {
  // Get cart items for a user
  static async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT c.id as cart_id, c.quantity, c.user_id, 
              f.id as food_id, f.name, f.description, f.price, f.image_url, f.category
       FROM cart c
       JOIN food_items f ON c.food_item_id = f.id
       WHERE c.user_id = ? AND f.is_available = TRUE`,
      [userId]
    );
    return rows;
  }

  // Add item to cart
  static async addItem(userId, foodItemId, quantity = 1) {
    // Check if item already in cart
    const [existing] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND food_item_id = ?',
      [userId, foodItemId]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + quantity;
      await db.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND food_item_id = ?',
        [newQuantity, userId, foodItemId]
      );
      return existing[0].id;
    } else {
      // Insert new item
      const [result] = await db.query(
        'INSERT INTO cart (user_id, food_item_id, quantity) VALUES (?, ?, ?)',
        [userId, foodItemId, quantity]
      );
      return result.insertId;
    }
  }

  // Update cart item quantity
  static async updateQuantity(userId, foodItemId, quantity) {
    if (quantity <= 0) {
      return await this.removeItem(userId, foodItemId);
    }
    
    const [result] = await db.query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND food_item_id = ?',
      [quantity, userId, foodItemId]
    );
    return result.affectedRows > 0;
  }

  // Remove item from cart
  static async removeItem(userId, foodItemId) {
    const [result] = await db.query(
      'DELETE FROM cart WHERE user_id = ? AND food_item_id = ?',
      [userId, foodItemId]
    );
    return result.affectedRows > 0;
  }

  // Clear cart
  static async clearCart(userId) {
    const [result] = await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    return result.affectedRows > 0;
  }

  // Get cart total
  static async getCartTotal(userId) {
    const [rows] = await db.query(
      `SELECT SUM(c.quantity * f.price) as total
       FROM cart c
       JOIN food_items f ON c.food_item_id = f.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows[0].total || 0;
  }

  // Get cart item count
  static async getCartCount(userId) {
    const [rows] = await db.query(
      'SELECT SUM(quantity) as count FROM cart WHERE user_id = ?',
      [userId]
    );
    return rows[0].count || 0;
  }
}

module.exports = Cart;