const pool = require("../db");
const { encode } = require("../services/base62");
const redisClient = require("../db/redis");

exports.createShortUrl = async (req, res) => {
  try {
    const { url, expires_in_days } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!expires_in_days) {
      return res.status(400).json({ error: "expires in days is required" });
    }

    const expiresAt = expires_in_days
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    // Insert long URL first
    const result = await pool.query(
      "INSERT INTO urls (long_url, expires_at) VALUES ($1, $2) RETURNING id",
      [url, expiresAt]
    );

    const id = result.rows[0].id;
    const shortCode = encode(id);

    // Update row with short_code
    await pool.query(
      "UPDATE urls SET short_code = $1 WHERE id = $2",
      [shortCode, id]
    );

    res.json({
      short_url: `${process.env.BASE_URL}/${shortCode}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1️⃣ Check Redis first
    const cachedUrl = await redisClient.get(shortCode);

    if (cachedUrl) {
      await pool.query(
        "UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1",
        [shortCode]
      );

      return res.redirect(cachedUrl);
    }

    // 2️⃣ If not found in cache → DB
    const result = await pool.query(
      "SELECT long_url, expires_at FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    const expiresAt = result.rows[0].expires_at;

    if (expiresAt && new Date(expiresAt) < new Date()) {
      return res.status(410).json({ error: "URL expired" });
    }

    const longUrl = result.rows[0].long_url;

    // 3️⃣ Cache it for 1 hour
    await redisClient.set(shortCode, longUrl, {
      EX: 3600
    });

    await pool.query(
      "UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1",
      [shortCode]
    );

    res.redirect(longUrl);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};