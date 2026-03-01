const pool = require("./index");

async function waitForDatabase(retries = 5, delay = 5000) {
  while (retries) {
    try {
      await pool.query("SELECT 1");
      console.log("Database connected successfully.");
      return;
    } catch (err) {
      console.log("Database not ready, retrying...");
      retries -= 1;
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error("Database connection failed after retries.");
}

async function initDatabase() {
  try {
    await waitForDatabase(); // 🔥 Wait until DB is ready

    console.log("Initializing database...");

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

    console.log("Database initialized successfully.");

  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

module.exports = initDatabase;