const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
