const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { body } = require("express-validator");

// REGISTER VALIDATION
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),

  body("role")
    .optional()
    .isIn(["user", "owner", "admin"])
    .withMessage("Invalid role value")
];

// LOGIN VALIDATION
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters")
];

router.post("/create", userController.createUser);
router.get("/get", userController.getUsers);
router.get("/get/:id", userController.getUserById);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

// ✅ REGISTER
router.post("/register", registerValidation, userController.signup);

// ✅ LOGIN
router.post("/login", loginValidation, userController.loginUser);

module.exports = router;