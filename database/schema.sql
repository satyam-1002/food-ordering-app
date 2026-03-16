-- Food Ordering Database Schema
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS food_ordering_db;
USE food_ordering_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    preparation_time INT DEFAULT 15,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_food (user_id, food_item_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT NOT NULL,
    payment_method ENUM('cash', 'card', 'upi') DEFAULT 'cash',
    notes TEXT,
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@foodapp.com', '$2a$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample food items
INSERT INTO food_items (name, description, price, category, image_url, preparation_time) VALUES
-- Burgers
('Classic Burger', 'Juicy beef patty with fresh lettuce, tomato, and special sauce', 149.00, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 15),
('Cheese Burger', 'Classic burger with melted cheddar cheese', 169.00, 'Burgers', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', 15),
('Chicken Burger', 'Crispy chicken patty with mayo and veggies', 159.00, 'Burgers', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', 12),
('Veggie Burger', 'Healthy veggie patty with fresh vegetables', 129.00, 'Burgers', 'https://images.unsplash.com/photo-1520072968400-4871b5a3f7d8?w=400', 10),

-- Pizza
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 249.00, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 20),
('Pepperoni Pizza', 'Loaded with pepperoni and extra cheese', 299.00, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 20),
('BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce and onions', 319.00, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 22),
('Veggie Supreme Pizza', 'Loaded with bell peppers, olives, mushrooms, and onions', 279.00, 'Pizza', 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400', 18),

-- Biryani
('Chicken Biryani', 'Aromatic basmati rice with tender chicken pieces', 220.00, 'Biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 25),
('Mutton Biryani', 'Traditional Hyderabadi style mutton biryani', 280.00, 'Biryani', 'https://images.unsplash.com/photo-1589302168068-964664d44dc0?w=400', 30),
('Veg Biryani', 'Fragrant rice with mixed vegetables and spices', 180.00, 'Biryani', 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', 20),
('Egg Biryani', 'Flavorful biryani with boiled eggs', 190.00, 'Biryani', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', 20),

-- Chinese
('Hakka Noodles', 'Stir-fried noodles with vegetables', 159.00, 'Chinese', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 15),
('Fried Rice', 'Classic vegetable fried rice', 149.00, 'Chinese', 'https://images.unsplash.com/photo-1603133872878e6bbb5c8a95d?w=400', 12),
('Chilli Chicken', 'Spicy Indo-Chinese chicken preparation', 199.00, 'Chinese', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', 18),
('Manchurian', 'Veggie balls in tangy manchurian sauce', 169.00, 'Chinese', 'https://images.unsplash.com/photo-1645696303168-b9d4cf3d785d?w=400', 15),

-- Desserts
('Chocolate Brownie', 'Warm chocolate brownie with ice cream', 129.00, 'Desserts', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', 10),
('Gulab Jamun', 'Traditional Indian sweet', 79.00, 'Desserts', 'https://images.unsplash.com/photo-1666190020611-22daef8ef46e?w=400', 5),
('Ice Cream Sundae', 'Vanilla ice cream with chocolate syrup and nuts', 149.00, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 5),
('Rasmalai', 'Soft paneer dumplings in sweet milk', 99.00, 'Desserts', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', 5),

-- Beverages
('Coca Cola', 'Refreshing cola drink', 49.00, 'Beverages', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', 2),
('Fresh Lime Soda', 'Fresh lime with soda', 59.00, 'Beverages', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', 5),
('Mango Lassi', 'Creamy mango yogurt drink', 89.00, 'Beverages', 'https://images.unsplash.com/photo-1587049352846-4f1a83f9b27f?w=400', 5),
('Cold Coffee', 'Chilled coffee with ice cream', 99.00, 'Beverages', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 5);

-- Create index for faster queries
CREATE INDEX idx_food_category ON food_items(category);
CREATE INDEX idx_food_available ON food_items(is_available);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart(user_id);