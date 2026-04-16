const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

const registerValidation = [
body("name").notEmpty(),
body("email").isEmail(),
body("password").isLength({min:5})
];

const loginValidation = [
body("email").isEmail(),
body("password").isLength({min:5})
];

router.post("/register",registerValidation,userController.signup);

router.post("/login",loginValidation,userController.loginUser);

// PROFILE ROUTES (protected)
router.get("/get", authMiddleware(["user", "owner", "admin"]), userController.getProfile);
router.put("/update", authMiddleware(["user", "owner", "admin"]), userController.updateProfile);
router.put("/change-password", authMiddleware(["user", "owner", "admin"]), userController.changePassword);

module.exports = router;