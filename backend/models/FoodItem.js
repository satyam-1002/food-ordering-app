const db = require('../config/database');

class FoodItem {
  // Get all food items
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM food_items WHERE is_available = TRUE ORDER BY category, name');
    return rows;
  }

  // Get food items by category
  static async getByCategory(category) {
    const [rows] = await db.query('SELECT * FROM food_items WHERE category = ? AND is_available = TRUE', [category]);
    return rows;
  }

  // Get all categories
  static async getCategories() {
    const [rows] = await db.query('SELECT DISTINCT category FROM food_items WHERE is_available = TRUE ORDER BY category');
    return rows.map(row => row.category);
  }

  // Get single food item
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM food_items WHERE id = ?', [id]);
    return rows[0];
  }

  // Create food item (admin)
  static async create(itemData) {
    const { name, description, price, category, image_url, preparation_time, is_available } = itemData;
    const [result] = await db.query(
      'INSERT INTO food_items (name, description, price, category, image_url, preparation_time, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image_url, preparation_time, is_available ?? true]
    );
    return result.insertId;
  }

  // Update food item (admin)
  static async update(id, itemData) {
    const { name, description, price, category, image_url, preparation_time, is_available } = itemData;
    const [result] = await db.query(
      'UPDATE food_items SET name = ?, description = ?, price = ?, category = ?, image_url = ?, preparation_time = ?, is_available = ? WHERE id = ?',
      [name, description, price, category, image_url, preparation_time, is_available, id]
    );
    return result.affectedRows > 0;
  }

  // Delete food item (admin)
  static async delete(id) {
    const [result] = await db.query('DELETE FROM food_items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Search food items
  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await db.query(
      'SELECT * FROM food_items WHERE (name LIKE ? OR description LIKE ? OR category LIKE ?) AND is_available = TRUE',
      [searchTerm, searchTerm, searchTerm]
    );
    return rows;
  }
}

module.exports = FoodItem;