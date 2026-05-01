# Node.js E-Commerce Application with Multiple Databases

A full-stack e-commerce web application built with Node.js, Fastify, and multiple database technologies (MongoDB, MySQL, and Redis). This project demonstrates best practices for integrating different databases in a single Node.js application.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Docker Setup](#docker-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

---

## 🎯 Project Overview

This application is a simple e-commerce shop with the following features:

- **Product Management**: Browse and manage shop items
- **User Authentication**: User registration and login with encrypted passwords
- **Shopping Basket**: Add items to basket (stored in Redis)
- **Order Management**: Create and view orders
- **Admin Panel**: Manage users, items, and orders

The project demonstrates how to effectively use three different database technologies in a single application, each optimized for different use cases.

---

## 🛠️ Technologies Used

### Backend Framework
- **Fastify** (v5.2.1) - Modern, fast web framework for Node.js
- **Node.js** - JavaScript runtime environment

### Databases

#### 1. **MongoDB** (via Mongoose ODM)
- **Version**: Latest stable
- **Use Case**: Product catalog and items management
- **Features**: Flexible schema, full-text search, automatic timestamps

#### 2. **MySQL** (via Sequelize ORM)
- **Version**: Latest stable
- **Use Case**: User accounts and order management
- **Features**: ACID compliance, relational data, strong consistency

#### 3. **Redis**
- **Version**: Latest stable
- **Use Case**: Session management and shopping basket storage
- **Features**: In-memory caching, fast data retrieval, session persistence

### Additional Libraries
- **ioredis** (v5.10.1) - Redis client for Node.js
- **mongoose** (v9.5.0) - MongoDB ODM
- **sequelize** (v6.37.8) - SQL ORM
- **mysql2** (v3.22.3) - MySQL driver
- **@fastify/view** (v10.0.2) - View plugin with EJS templating
- **@fastify/session** (v11.1.1) - Session management
- **connect-redis** (v9.0.0) - Redis session store
- **argon2** (v0.44.0) - Password hashing
- **ejs** (v3.1.10) - Templating engine

### Development Tools
- **nodemon** (v3.1.9) - Auto-restart server during development
- **ESLint** (v8.57.1) - Code linting
- **Prettier** (v3.4.2) - Code formatting

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Docker** (v20.10.0 or higher) - For containerized database setup
- **Docker Compose** (v1.29.0 or higher) - For orchestrating multi-container setup

### Verify Installations

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version
```

---

## 💻 Installation Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd databases-for-nodejs-developers-5978020
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

This will install all the dependencies listed in `package.json`.

### Step 3: Environment Setup

Create a `.env` file in the root directory (optional, as defaults are provided in `src/config/index.js`):

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simpleshop
MYSQL_URI=mysql://root:secret@localhost:3306/simpleshop
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_SECRET=x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE=
```

### Step 4: Verify npm Scripts

The `package.json` includes the following scripts:

- **`npm run dev`** - Start the application in development mode with nodemon (auto-restart on file changes)
- **`npm start`** - Start the application in production mode

---

## 🐳 Docker Setup

This section explains how to set up and run MongoDB, MySQL, and Redis using Docker.

### Option 1: Using Docker Compose (Recommended)

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: simpleshop-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: simpleshop
    volumes:
      - mongodb_data:/data/db
    networks:
      - simpleshop-network

  mysql:
    image: mysql:latest
    container_name: simpleshop-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: simpleshop
      MYSQL_USER: shopuser
      MYSQL_PASSWORD: shoppassword
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - simpleshop-network

  redis:
    image: redis:latest
    container_name: simpleshop-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - simpleshop-network

volumes:
  mongodb_data:
  mysql_data:
  redis_data:

networks:
  simpleshop-network:
    driver: bridge
```

#### Running Docker Compose

```bash
# Start all services in the background
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop all services and remove volumes
docker-compose down -v
```

### Option 2: Individual Docker Commands

#### MongoDB Setup

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d \
  --name simpleshop-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=simpleshop \
  -v mongodb_data:/data/db \
  mongo:latest

# Verify MongoDB is running
docker exec simpleshop-mongodb mongosh --eval "db.adminCommand('ping')"
```

#### MySQL Setup

```bash
# Pull MySQL image
docker pull mysql

# Run MySQL container
docker run -d \
  --name simpleshop-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=simpleshop \
  -v mysql_data:/var/lib/mysql \
  mysql:latest

# Verify MySQL is running
docker exec simpleshop-mysql mysql -u root -psecret -e "SELECT 1"
```

#### Redis Setup

```bash
# Pull Redis image
docker pull redis

# Run Redis container
docker run -d \
  --name simpleshop-redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:latest

# Verify Redis is running
docker exec simpleshop-redis redis-cli ping
```

#### Useful Docker Commands

```bash
# View container logs
docker logs simpleshop-mongodb
docker logs simpleshop-mysql
docker logs simpleshop-redis

# Access MongoDB shell
docker exec -it simpleshop-mongodb mongosh

# Access MySQL shell
docker exec -it simpleshop-mysql mysql -u root -psecret

# Access Redis CLI
docker exec -it simpleshop-redis redis-cli

# Stop a container
docker stop simpleshop-mongodb

# Restart a container
docker restart simpleshop-mongodb

# Remove a container
docker rm simpleshop-mongodb
```

---

## 📊 Database Configuration

### MongoDB (Product Items)

**File**: `src/plugins/databases/mongoose.js`

**Purpose**: Store product items/catalog

**Model**: `src/models/mongoose/Item.js`

**Why MongoDB?**
- **Flexible Schema**: Product items can have varying attributes and tags
- **Scalability**: Document-based structure easily scales with product catalog
- **Full-Text Search**: Built-in full-text search on product names and tags
- **Performance**: Fast read operations for product browsing

**Data Structure**:
```javascript
{
  sku: String (unique),
  name: String,
  price: Number,
  tags: [String],
  timestamps: { createdAt, updatedAt }
}
```

**Configuration**:
```javascript
mongodb: {
  uri: 'mongodb://localhost:27017/simpleshop',
  options: {
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 3000
  }
}
```

---

### MySQL (Users & Orders)

**File**: `src/plugins/databases/sequelize.js`

**Purpose**: Store user accounts and order data with relationships

**Models**: 
- `src/models/sequelize/User.js` - User accounts with authentication
- `src/models/sequelize/Order.js` - Order details
- `src/models/sequelize/OrderItem.js` - Individual items in orders

**Why MySQL?**
- **Data Integrity**: ACID compliance ensures consistency of transactions
- **Relationships**: Strong relational model for users → orders → order items
- **Security**: Enforced constraints and validation
- **Transactions**: Atomic operations for order processing

**Data Structure**:
```javascript
// User
{
  id: INTEGER (primary key),
  email: STRING (unique),
  password: STRING (hashed with argon2),
  createdAt: DATETIME,
  updatedAt: DATETIME
}

// Order
{
  id: INTEGER (primary key),
  userId: INTEGER (foreign key),
  createdAt: DATETIME,
  updatedAt: DATETIME
}

// OrderItem
{
  id: INTEGER (primary key),
  orderId: INTEGER (foreign key),
  // Additional order item details
}
```

**Configuration**:
```javascript
mysql: {
  uri: 'mysql://root:secret@localhost:3306/simpleshop',
  options: {
    logging: false
  }
}
```

---

### Redis (Session & Basket Storage)

**File**: `src/plugins/databases/redis.js`

**Purpose**: Session management and shopping basket caching

**Why Redis?**
- **Performance**: In-memory data structure store provides ultra-fast access
- **Session Storage**: Lightweight session persistence for authenticated users
- **Caching**: Reduces database load by caching frequently accessed data
- **TTL Support**: Automatic expiration of session data
- **Atomic Operations**: Reliable operations for shopping basket transactions

**Data Structure**:
```javascript
// Session data (stored as key-value pairs)
// Pattern: session:<sessionId> → { userId, user_data }

// Shopping basket (stored as Redis hash or key-value)
// Pattern: basket:<sessionId> → { items: [...], total: amount }
```

**Configuration**:
```javascript
redis: {
  host: 'localhost',
  port: 6379
}
```

---

## 🚀 Running the Application

### Development Mode

Start the application with auto-reload:

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Production Mode

Build and start the application:

```bash
npm start
```

### Common Issues & Troubleshooting

**Issue**: `Failed to connect to MongoDB`
```bash
# Solution: Ensure MongoDB is running
docker-compose up -d mongodb
# or
docker start simpleshop-mongodb
```

**Issue**: `Failed to connect to MySQL`
```bash
# Solution: Ensure MySQL is running and credentials are correct
docker-compose up -d mysql
# Verify credentials in src/config/index.js
```

**Issue**: `Failed to connect to Redis`
```bash
# Solution: Ensure Redis is running
docker-compose up -d redis
# or
docker start simpleshop-redis
```

**Issue**: `Port already in use`
```bash
# Solution: Change port in src/config/index.js or docker-compose.yml
# Or kill the process using the port
```

---

## 📁 Project Structure

```
databases-for-nodejs-developers-5978020/
├── src/
│   ├── server.js                 # Main application entry point
│   ├── config/
│   │   └── index.js              # Database configurations
│   ├── models/
│   │   ├── mongoose/
│   │   │   └── Item.js           # MongoDB product item model
│   │   └── sequelize/
│   │       ├── User.js           # MySQL user model
│   │       ├── Order.js          # MySQL order model
│   │       └── OrderItem.js      # MySQL order item model
│   ├── plugins/
│   │   ├── databases/
│   │   │   ├── mongoose.js       # MongoDB connection plugin
│   │   │   ├── sequelize.js      # MySQL connection plugin
│   │   │   └── redis.js          # Redis connection plugin
│   │   ├── routes.js             # Route registration
│   │   ├── session.js            # Session configuration
│   │   ├── basket.js             # Shopping basket management
│   │   ├── views.js              # EJS view engine setup
│   │   ├── static.js             # Static file serving
│   │   └── defaults.js           # Default middleware
│   ├── routes/
│   │   ├── index.js              # Home page routes
│   │   ├── shop.js               # Product browsing routes
│   │   ├── basket.js             # Shopping basket routes
│   │   ├── user.js               # User authentication routes
│   │   └── admin/
│   │       ├── item.js           # Admin item management
│   │       ├── orders.js         # Admin order management
│   │       └── user.js           # Admin user management
│   └── views/
│       ├── index.ejs             # Home page template
│       ├── shop.ejs              # Product listing template
│       ├── basket.ejs            # Shopping basket template
│       ├── login.ejs             # Login page template
│       └── admin/
│           ├── item.ejs          # Admin item template
│           ├── orders.ejs        # Admin orders template
│           └── user.ejs          # Admin users template
├── public/
│   └── css/
│       └── site.css              # Application styling
├── sample-data/
│   └── sample-items.json         # Sample product data
├── package.json                  # Project dependencies
├── docker-compose.yml            # Docker services configuration
└── README.md                      # This file
```

---

## 🔗 API Endpoints

### Shop Routes (`/shop`)
- **GET /shop** - View all products

### User Routes (`/user`)
- **GET /user/login** - Login page
- **POST /user/login** - Login submission
- **POST /user/logout** - User logout
- **GET /user/register** - Registration page
- **POST /user/register** - Registration submission

### Basket Routes (`/basket`)
- **GET /basket** - View shopping basket
- **POST /basket/add** - Add item to basket
- **POST /basket/remove** - Remove item from basket

### Admin Routes (`/admin`)
- **GET /admin/items** - Manage products
- **GET /admin/users** - Manage users
- **GET /admin/orders** - Manage orders

---

## 📝 Configuration Details

All configuration is centralized in `src/config/index.js`:

```javascript
export const config = {
  server: {
    port: process.env.PORT || 3000
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/simpleshop',
    options: { /* ... */ }
  },
  mysql: {
    uri: 'mysql://root:secret@localhost:3306/simpleshop',
    options: { /* ... */ }
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  session: {
    secret: "x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE="
  }
};
```

**To modify database connections**:
1. Edit connection URIs in `src/config/index.js`
2. Update Docker ports in `docker-compose.yml` if using Docker
3. Restart the application

---

## 🔐 Security Notes

- **Passwords**: Hashed using Argon2 algorithm
- **Sessions**: Encrypted and stored in Redis
- **Environment Variables**: Use `.env` for sensitive data
- **CORS**: Configure as needed for your frontend

---

## 📚 Additional Resources

- [Fastify Documentation](https://www.fastify.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Redis Documentation](https://redis.io/documentation)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Docker Documentation](https://docs.docker.com/)

---

**Happy Coding!** 🎉
