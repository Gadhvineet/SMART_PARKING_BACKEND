const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const sendEmail = require("../utils/sendMail");


// ==============================
// SIGNUP USER
// ==============================

const signup = async (req, res) => {
  try {

    // ✅ CHECK VALIDATION ERRORS
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    let { name, email, password, role } = req.body;

    // ✅ Normalize email
    email = email.trim().toLowerCase();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await newUser.save();

    // ✅ Send Welcome Email
    try {
      await sendEmail(
        savedUser.email,
        "Welcome to FindPark 🚗",
        `Hello ${savedUser.name},

Welcome to FindPark 🚗

Your account has been successfully created.

Now you can:
✔ Add vehicles
✔ Find parking
✔ Book slots (coming soon)

Happy Parking 🚗
- Team FindPark`
      );
    } catch (err) {
      console.log("Email failed but user created:", err.message);
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });

  } catch (error) {

    console.error("Error during signup:", error.message);

    res.status(500).json({
      message: "Server error while signing up",
      error: error.message,
    });

  }
};



// ==============================
// LOGIN USER
// ==============================

const loginUser = async (req, res) => {

  try {

    // ✅ CHECK VALIDATION ERRORS
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    let { email, password } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim();

    // ✅ Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error during login",
      error: error.message
    });

  }

};



// ==============================
// CREATE USER (ADMIN / TEST)
// ==============================

const createUser = async (req, res) => {

  try {

    const user = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      user: user
    });

  } catch (error) {

    res.status(500).json({
      message: "error while creating user",
      error: error.message
    });

  }

};



// ==============================
// GET ALL USERS
// ==============================

const getUsers = async (req, res) => {

  try {

    const users = await User.find();

    res.status(200).json({
      message: "Users fetched successfully",
      users: users
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while fetching users",
      error: error
    });

  }

};



// ==============================
// GET USER BY ID
// ==============================

const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    res.status(200).json({
      message: "User fetched successfully",
      user: user
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while fetching user",
      error: error
    });

  }

};



// ==============================
// UPDATE USER
// ==============================

const updateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: user
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while updating user",
      error: error
    });

  }

};



// ==============================
// DELETE USER
// ==============================

const deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error while deleting user",
      error: error
    });

  }

};



// ==============================
// GET PROFILE (BY TOKEN)
// ==============================

const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching profile",
      error: error.message
    });

  }

};



// ==============================
// UPDATE PROFILE (BY TOKEN)
// ==============================

const updateProfile = async (req, res) => {

  try {

    const { name, email } = req.body;

    // Only allow updating name and email
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.trim().toLowerCase();

    // Check if email already taken by another user
    if (email) {
      const existing = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.user.id }
      });

      if (existing) {
        return res.status(400).json({
          message: "Email is already in use by another account"
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });

  }

};



// ==============================
// CHANGE PASSWORD
// ==============================

const changePassword = async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({
        message: "New password must be at least 5 characters"
      });
    }

    // Get user WITH password
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error changing password",
      error: error.message
    });

  }

};



// ==============================
// EXPORT
// ==============================

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  signup,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
};