
# URL Shortener (Bitly Clone)

A simple URL shortener service built with Node.js, Express, and PostgreSQL using Base62 encoding.

## 🚀 Features

- Create short URL
- Redirect to original URL
- Base62 deterministic encoding
- RESTful API design

## 🏗 Architecture

- Express API
- PostgreSQL database
- Base62 encoding
- Clean layered architecture

## 🛠 Tech Stack

- Node.js
- Express
- PostgreSQL
- dotenv

## 🔧 Setup Instructions
### 1. Clone repo
```bash
git clone https://github.com/EzharAnsari/url-shortener.git
cd url-shortener
```
### 2. Install dependencies
```bash
npm install
```
### 3. Setup environment variables
```bash
cp .env.example .env
```

Update .env with your database credentials.

### 4. Start server
```bash
npx nodemon src/app.js
```
## 📡 API Endpoints
### Create short URL

`POST /shorten`
```json
{
  "url": "https://example.com"
}
```
Redirect

`GET /:shortCode`

## 📈 Future Improvements

- Redis caching
- Expiration support
- Click analytics
- Rate limiting
- Docker support
- Distributed ID generation

## 🧠 Learning Goals

This project demonstrates:
- System design fundamentals
- ID generation strategies
- Database indexing
- REST API architecture
