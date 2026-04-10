const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { body } = require("express-validator");

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

module.exports = router;