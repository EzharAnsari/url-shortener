const pool = require("./index");
const logger = require("../logger");

async function waitForDatabase(retries = 5, delay = 5000) {
  while (retries) {
    try {
      await pool.query("SELECT 1");
      logger.info("Database connected successfully.");
      return;
    } catch (err) {
      logger.error("Database not ready, retrying...");
      retries -= 1;
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error("Database connection failed after retries.");
}

async function initDatabase() {
  try {
    await waitForDatabase(); // 🔥 Wait until DB is ready

    logger.info("Initializing database...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(10) UNIQUE,
        long_url TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        click_count INTEGER DEFAULT 0,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info("Database initialized successfully.");

  } catch (err) {
    logger.error("Database initialization failed:", err);
    process.exit(1);
  }
}

module.exports = initDatabase;