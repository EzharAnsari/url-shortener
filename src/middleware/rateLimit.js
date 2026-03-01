const rateLimit = require("express-rate-limit");
const {RedisStore} = require("rate-limit-redis");
const redisClient = require("../db/redis");

module.exports = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 1000,
  max: 100, // 100 requests per minute
});