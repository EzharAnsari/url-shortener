const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth")

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/shorten", authMiddleware, urlController.createShortUrl);
router.get("/:shortCode", urlController.redirectUrl);

module.exports = router;