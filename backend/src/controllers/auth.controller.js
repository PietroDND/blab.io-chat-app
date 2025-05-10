import { generateToken } from "../lib/utils.js";
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const { username, fullname, email, password } = req.body;
    try {
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required' });
        }
        const isUsernameValidRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!isUsernameValidRegex.test(username)) {
            return res.status(400).json({ msg: 'Username must be 3-20 characters long and must not include spaces or special characters' });
        }
        if (password.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
        }
        //Check if email is already registered
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        //Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Create user
        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        });

        if (newUser) {
            //Generate JSONWebToken
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            });

        } else {
            return res.status(400).json({ msg: 'Invalid User Data' });
        }

    } catch (error) {
        console.log('Error in signup controller: ', error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    const { emailOrUsername, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or username" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
  try {
    res.cookie("blab.io_authToken", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, username } = req.body;
        const userId = req.user._id;

        const updateData = {};

        // Handle username update
        if (username) {
          const existingUser = await User.findOne({ username });

          if (existingUser && !existingUser._id.equals(userId)) {
            return res.status(400).json({ msg: 'Username is already taken' });
          }

          updateData.username = username;
        }

        // Handle profile picture upload to Cloudinary
        if (profilePic) {
          const response = await cloudinary.uploader.upload(profilePic);
          updateData.profilePic = response.secure_url;
        }

        if (!username && !profilePic) {
          return res.status(400).json({ msg: 'No data provided to update' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.status(200).json(updatedUser);
  
    } catch (error) {
        console.log('Error while updating profile:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('Error in checkAuth controller', error.message);
        res.status(500).json({msg: 'Internal Server Error'});
    }
};
  