const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/get-me", authMiddleware, authController.getMe)
router.post("/add-services", authMiddleware, roleMiddleware("owner"), addService)


module.exports = router;