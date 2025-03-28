const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Generate JWT Token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h"});
};

exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "Email already in use"});
        }

        const user = await User.create({
            fullName, 
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user, 
            token: generateToken(user._id),
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        const user = await User.findOne({ email });
        if(!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error logging in", error: err.message });
    }
};

exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({message: "User Not Found" });
        }

        res.status(200).json(user);
    } catch(err){
        res
            .status(500)
            .json({ message: "Error logging in", error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { fullName, profileImageUrl } = req.body;
    
    // Check if any update fields are provided
    if (!fullName && !profileImageUrl) {
      return res.status(400).json({ message: "No update information provided" });
    }
    
    try {
      // Create an object with the fields to update
      const updateFields = {};
      if (fullName) updateFields.fullName = fullName;
      if (profileImageUrl) updateFields.profileImageUrl = profileImageUrl;
      
      // Find the user and update
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true }
      ).select("-password");
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: err.message });
    }
  };