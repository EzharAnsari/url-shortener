const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET = process.env.JWT_SECRET;

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { hashPassword, comparePassword, generateToken };