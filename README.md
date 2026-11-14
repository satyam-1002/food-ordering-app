# Online Food Ordering Website

A full-stack food ordering web application built with **React.js, Node.js, Express.js, and TiDB Cloud (MySQL-compatible database)**. Users can browse food items, manage their cart, place orders, and view their order history. Admins can manage food items and orders.

## Live Demo

**Live Website:** https://food-ordering-app-xi-indol.vercel.app

**GitHub Repository:** https://github.com/satyam-1002/food-ordering-app

## Features

### Customer
- Browse food items and categories.
- Search and filter food items.
- User registration and login with JWT authentication.
- Add, update, and remove items from the cart.
- Place orders with delivery details.
- View order history and order details.
- Manage user profile.

### Admin
- Admin dashboard with order statistics.
- Add, edit, and delete food items.
- View and manage customer orders.
- Update order statuses.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js 18, React Router, Axios, CSS3 |
| Backend | Node.js, Express.js |
| Database | TiDB Cloud (MySQL-compatible), MySQL2 |
| Authentication | JWT, bcryptjs |
| Tools | Git, GitHub |

## Project Structure

```text
food-ordering-app/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.js
│       └── index.js
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── certs/
│   ├── server.js
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## Local Setup

### Prerequisites
- Node.js and npm
- Git
- TiDB Cloud account or a compatible MySQL database

### 1. Clone the Repository

```bash
git clone https://github.com/satyam-1002/food-ordering-app.git
cd food-ordering-app
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=food_ordering_db
JWT_SECRET=your_jwt_secret
```

Configure your database connection and SSL certificate according to your database provider. The deployed TiDB connection uses port `4000` and the CA certificate included in `backend/certs/`.

Start the backend:

```bash
npm start
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will run locally at:

```text
http://localhost:3000
```

## Deployment

The application is deployed using:

- **Frontend – Vercel:** https://food-ordering-app-xi-indol.vercel.app
- **Backend – Render:** https://food-ordering-app-90gx.onrender.com
- **Database – TiDB Cloud:** MySQL-compatible cloud database

The React frontend communicates with the deployed Express backend through API requests. The backend connects to TiDB Cloud for database operations.

## API Overview

| Module | Endpoint | Method |
|---|---|---|
| Authentication | `/api/auth/register` | POST |
| Authentication | `/api/auth/login` | POST |
| Food Items | `/api/food` | GET |
| Categories | `/api/food/categories` | GET |
| Cart | `/api/cart` | GET |
| Cart | `/api/cart/add` | POST |
| Orders | `/api/orders` | POST |
| My Orders | `/api/orders/my-orders` | GET |
| Admin Foods | `/api/admin/foods` | GET, POST |
| Admin Orders | `/api/admin/orders` | GET |

Additional endpoints support food search, cart management, order details, profile updates, and admin operations.

## Security

- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected customer and admin routes.
- Environment variables for sensitive configuration.
- HTTPS-enabled production deployment.

---

**Developer:** Satyam Singh

**GitHub:** https://github.com/satyam-1002

**LinkedIn:** https://www.linkedin.com/in/satyamsng/
