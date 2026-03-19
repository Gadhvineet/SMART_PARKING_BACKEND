const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const signup = async (req,res)=>{
    try{
        const { name , email , password } = req.body;
        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.status(400).json({
                message:"User already exists with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()
        res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });

  }   catch(error){
    console.error("Error during signup:", error.message); // log exact error
    res.status(500).json({ 
        message:"Server error while signing up",
        error: error.message // send error message to frontend temporarily for debugging
    })
}
}

const loginUser = async (req,res)=>{
    try{
        const { email , password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
         const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
 res.status(200).json({
            message: "Login successful",
            token: token,
            user: user
        });

         } catch (error) {
        res.status(500).json({
            message: "Server error",
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

