const pool = require("../db");
const redisClient = require("../db/redis");

async function syncClicks() {
  const keys = await redisClient.keys("clicks:*");

  for (let key of keys) {
    const shortCode = key.split(":")[1];
    const count = await redisClient.get(key);

    if (count > 0) {
      await pool.query(
        "UPDATE urls SET click_count = click_count + $1 WHERE short_code = $2",
        [count, shortCode]
      );

      await redisClient.del(key);
    }
  }
}

setInterval(syncClicks, 30000);