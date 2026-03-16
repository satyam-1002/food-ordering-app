const db = require('../config/database');

class Order {
  // Create a new order
  static async create(orderData, items) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { user_id, total_amount, delivery_address, payment_method, notes } = orderData;
      
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, delivery_address, payment_method, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, total_amount, delivery_address, payment_method, notes, 'pending']
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, food_item_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.food_item_id, item.quantity, item.price]
        );
      }
      
      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get orders by user ID
  static async getByUserId(userId) {
    const [orders] = await db.query(
      `SELECT o.*, 
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return orders;
  }

  // Get order by ID with items
  static async getById(orderId) {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (orders.length === 0) return null;
    
    const order = orders[0];
    
    const [items] = await db.query(
      `SELECT oi.*, f.name, f.description, f.image_url
       FROM order_items oi
       JOIN food_items f ON oi.food_item_id = f.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    order.items = items;
    return order;
  }

  // Update order status
  static async updateStatus(orderId, status) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }
    
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    
    return result.affectedRows > 0;
  }

  // Get all orders (admin)
  static async getAll(limit = 50, offset = 0) {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return orders;
  }

  // Get orders by status (admin)
  static async getByStatus(status) {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.status = ?
       ORDER BY o.created_at DESC`,
      [status]
    );
    return orders;
  }

  // Get order statistics (admin)
  static async getStats() {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparing_orders,
        SUM(CASE WHEN status = 'out_for_delivery' THEN 1 ELSE 0 END) as out_for_delivery_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) as total_revenue
      FROM orders
    `);
    return stats[0];
  }
}

module.exports = Order;