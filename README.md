# FoodHub - Online Food Ordering Application

A complete full-stack food ordering web application built with React.js, Node.js, Express.js, and MySQL.

## 🍔 Features

### Customer Features
- **Home Page**: Browse featured food items and categories
- **Menu Page**: View all food items with category filtering and search
- **Cart System**: Add to cart, update quantities, remove items
- **Checkout**: Complete order with delivery details
- **User Authentication**: Login and registration with JWT
- **User Dashboard**: View order history and manage profile
- **Order Tracking**: Track order status in real-time

### Admin Features
- **Admin Dashboard**: Overview of orders and statistics
- **Food Management**: Add, edit, delete food items
- **Order Management**: View and update order statuses

## 🛠 Tech Stack

### Frontend
- React.js 18
- React Router v6
- Axios
- React Toastify
- React Icons
- CSS3 with custom properties

### Backend
- Node.js
- Express.js
- MySQL2
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Database
- MySQL

## 📁 Project Structure

```
food-ordering-app/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── food/
│   │   │   │   ├── FoodCard.js
│   │   │   │   └── FoodCard.css
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── Footer.js
│   │   │   │   └── Footer.css
│   │   │   └── routing/
│   │   │       ├── ProtectedRoute.js
│   │   │       └── AdminRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminFoods.js
│   │   │   │   ├── AdminOrders.js
│   │   │   │   └── Admin.css
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── Menu.js
│   │   │   ├── Menu.css
│   │   │   ├── Cart.js
│   │   │   ├── Cart.css
│   │   │   ├── Checkout.js
│   │   │   ├── Checkout.css
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── OrderDetails.js
│   │   │   └── OrderDetails.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── FoodItem.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── food.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── database/
│   └── schema.sql
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone or Download
Download and extract the project files.

### Step 2: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE food_ordering_db;
```

2. Import the schema:
```bash
mysql -u root -p food_ordering_db < database/schema.sql
```

Or run the SQL commands from `database/schema.sql` in your MySQL client.

### Step 3: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=food_ordering_db
JWT_SECRET=your_super_secret_jwt_key
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Step 4: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and go to: http://localhost:3000

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Food Items
- `GET /api/food` - Get all food items
- `GET /api/food/categories` - Get categories
- `GET /api/food/category/:category` - Get items by category
- `GET /api/food/:id` - Get single item
- `GET /api/food/search/query?q=` - Search items

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:id` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/foods` - Get all food items
- `POST /api/admin/foods` - Create food item
- `PUT /api/admin/foods/:id` - Update food item
- `DELETE /api/admin/foods/:id` - Delete food item
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/stats` - Get order statistics
- `GET /api/admin/users` - Get all users

## 👤 Demo Credentials

### Admin Account
- Email: admin@foodapp.com
- Password: admin123

## 🎨 Features Highlights

### Responsive Design
- Mobile-first approach
- Works seamlessly on all device sizes

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Admin-only routes

### User Experience
- Toast notifications for feedback
- Loading states
- Form validation
- Search and filter functionality

## 📧 Contact

For any queries or support, please reach out to the development team.

## 📄 License

This project is open-source and available under the MIT License.

---

**Happy Ordering! 🍕🍔🍜**