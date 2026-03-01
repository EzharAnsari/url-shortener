# 🔗 URL Shortener (Production-Style)

A scalable URL shortener service built with **Node.js, Express, PostgreSQL, and Redis**.

This project evolves from a basic Bitly-like clone into a production-style backend system with authentication, caching, rate limiting, background processing, and Docker support.

---

# 🚀 Features

## Core Features

* Create short URL from long URL
* Redirect short URL → original URL
* Base62 deterministic encoding
* PostgreSQL persistent storage

## Production Features (Phase 2 & 3)

* Redis cache (cache-aside pattern)
* Expiration support for URLs
* Click counter
* Redis-based click batching
* JWT authentication
* Password hashing (bcrypt)
* Rate limiting (Redis-backed)
* Docker & Docker Compose
* Load testing ready (Autocannon)
* Automatic DB table initialization
* Background worker for click synchronization
* Structured logging (Pino)

---

# 🏗 Architecture Overview

```
Client
   ↓
Express API
   ↓
Redis (cache + rate limit + click counters)
   ↓
PostgreSQL (persistent storage)
   ↓
Background Worker (batch click sync)
```

---

# 🔐 Authentication Flow

1. User registers
2. Password is hashed using bcrypt
3. User logs in
4. JWT token is issued
5. Protected endpoints require `Authorization: Bearer <token>`

---

# 📦 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Redis
* bcrypt
* jsonwebtoken
* Pino (logging)
* Docker
* Docker Compose
* Autocannon (load testing)

---

# 📂 Project Structure

```
url-shortener/
│
├── src/
│   ├── controllers/
│   │    ├── urlController.js
│   │    └── authController.js
│   ├── middleware/
│   │    ├── auth.js
│   │    └── rateLimit.js
│   ├── services/
│   │    ├── base62.js
│   │    └── auth.js
│   ├── db/
│   │    ├── index.js
│   │    ├── redis.js
│   │    └── init.js
│   ├── workers/
│   │    └── clickSync.js
│   ├── logger.js
│   └── app.js
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Setup Instructions

## Option 1 — Run with Docker (Recommended)

### 1️⃣ Start the system

```bash
docker-compose up --build
```

This starts:

* API (port 3000)
* PostgreSQL
* Redis

### 2️⃣ API available at:

```
http://localhost:3000
```

---

## Option 2 — Run Locally (Without Docker)

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Configure `.env`

```
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/url_shortener
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```

### 3️⃣ Start server

```bash
node src/app.js
```

---

# 🗄 Database Initialization

The application automatically creates required tables on startup:

* `users`
* `urls`

No manual SQL scripts required.

---

# 📡 API Endpoints

## 🔹 Register User

POST `/register`

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

---

## 🔹 Login

POST `/login`

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

## 🔹 Create Short URL (Protected)

POST `/shorten`

Headers:

```
Authorization: Bearer JWT_TOKEN
```

Body:

```json
{
  "url": "https://example.com",
  "expires_in_days": 7
}
```

---

## 🔹 Redirect

GET `/:shortCode`

Returns HTTP 302 redirect.

---

# ⚡ Performance Optimizations

## Redis Cache (Cache-Aside Pattern)

* Check Redis first
* If miss → fetch from DB
* Cache result with TTL

## Click Counter Optimization

Instead of updating DB on every request:

* Increment in Redis
* Background worker syncs counts every 30 seconds
* Reduces write pressure on PostgreSQL

---

# 🚦 Rate Limiting

* 100 requests per minute per IP
* Redis-backed
* Prevents abuse and brute-force attacks

---

# 🐳 Docker Architecture

Services:

* `app`
* `db` (PostgreSQL)
* `redis`

Database waits until ready before app initializes schema.

---

# 🔥 Load Testing

Install:

```bash
npm install -g autocannon
```

Test redirect performance:

```bash
autocannon -c 100 -d 20 http://localhost:3000/abc123
```

---

# 📈 Scalability Considerations

* Redis reduces DB read load
* Batched writes prevent DB bottleneck
* JWT avoids session storage
* Docker-ready for horizontal scaling
* Easy migration to:

  * Kafka (analytics)
  * ClickHouse (analytics DB)
  * Distributed ID generation
  * Sharding

---

# 🧠 System Design Concepts Demonstrated

* Cache-aside pattern
* Write optimization via batching
* JWT-based stateless auth
* Rate limiting with Redis
* Background workers
* Containerized services
* Idempotent DB initialization
* Read-heavy system design

---

# 🏆 Resume Description

> Designed and implemented a production-style URL shortener using Node.js, PostgreSQL, and Redis. Implemented JWT authentication, Redis caching, rate limiting, and asynchronous click batching to optimize performance and scalability.

---

# 📜 License

MIT License
