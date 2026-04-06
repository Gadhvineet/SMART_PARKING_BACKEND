const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendMail"); // 👈 ADD THIS IMPORT
const signup = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // ✅ FIX: Normalize email (VERY IMPORTANT)
    email = email.trim().toLowerCase();

    // ✅ STEP 1: Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ✅ STEP 2: Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // ✅ STEP 3: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ STEP 4: Create user
    const newUser = new User({
      name,
      email, // ✅ now normalized
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await newUser.save();

    // ✅ STEP 5: Send Welcome Email
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
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

  
    email = email.trim().toLowerCase();
    password = password.trim();

  
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

    // ✅ Generate token (WITH ROLE)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send response
    return res.status(200).json({
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

    return res.status(500).json({
      message: "Server error during login",
      error: error.message
    });
  }
};
const createUser = async (req,res)=>{
    try{
        const user = await User.create(req.body)
        res.status(201).json({
            message:"User created successfully",
            user:user
        })
    }
    catch(error){
       res.status(500).json({
            message:"error while creating user",
            error: error.message
        })
    }
}
const getUsers = async (req,res)=>{
    try{
        const users = await User.find()

        res.status(200).json({
            message:"Users fetched successfully",
            users:users
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching users",
            error:error
        })
    }
}
const getUserById = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        res.status(200).json({
            message:"User fetched successfully",
            user:user
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while fetching user",
            error:error
        })
    }
}
const updateUser = async (req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        res.status(200).json({
            message:"User updated successfully",
            user:user
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while updating user",
            error:error
        })
    }
}
const deleteUser = async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"User deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Error while deleting user",
            error:error
        })
    }
}

module.exports = { createUser , getUsers , getUserById , updateUser , deleteUser , signup, loginUser }

