const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address]
    );
    
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await db.query('SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // Update user
  static async update(id, userData) {
    const { name, phone, address } = userData;
    const [result] = await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, id]
    );
    return result.affectedRows > 0;
  }

  // Validate password
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (admin)
  static async getAll() {
    const [rows] = await db.query('SELECT id, name, email, phone, address, role, created_at FROM users');
    return rows;
  }
}

module.exports = User;