import { User } from "../models/userModel.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklistModel.js";

//User Registration
const saveUser = catchAsyncError(async (req, res, next) => {
    try {
        // decontructor
        const { username, email, password } = req.body;

        // null exception checker
        if (!username || !email || !password) {
            return next(new ErrorHandler("Please provide all the required fields", 400));
        }

        // check if user already exists or not
        let userExits = await User.findOne({ email });
        if (userExits) {
            return next(new ErrorHandler("User already exists", 409));
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);

        // create newUser object
        const newUser = {
            userId: new mongoose.Types.ObjectId(),
            username: username,
            email: email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        // console.log(newUser);

        const userRes = await User.create(newUser); 

        console.log("User saved successfully", userRes);
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            userId: userRes.userId
        });

    } catch (error) {
        console.error("Error saving user data", error);
        res.status(500).json({
            seccess: false,
            message: "Error saving user data",
            Error: err
        })
    }
});

// User Login
const userLogin = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //checking for missing inputs
        if (!email || !password) {
            return next(new ErrorHandler("Missing Credentials", 400));
        }
        //checking if user exists or not 
        let userData = await User.findOne({ email });
        if (!userData) {
            return next(new ErrorHandler("User not found", 404));
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return next(new ErrorHandler("Wrong email or password", 404));
        };

        // Generating token
        const token = jwt.sign(
            // payload
            {
                _id: userData._id,
                userId: userData.userId,
                username: userData.username,
                email: userData.email
            },
            process.env.TOKENSIGNATURE, //jwt signature
            { expiresIn: "24h" } //expiry
        );

        res.cookie("token", token, {
            sameSite: 'None',
            secure: true
        });

        res.status(200).json({
            token: token,
            user: {
                id: userData.userId,
                username: userData.username,
                email: userData.email
            }
        });

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error Logging In",
            Error: err
        })
    }
})


//Update User Profile
const updateUser = catchAsyncError(async (req, res, next) => {
    try {
        const { username, bio, profilePicture } = req.body;
        const userId = req.user._id;
        const updateUser = await User.findByIdAndUpdate(
            userId,
            { username, bio, profilePicture },
            { new: true, runValidators: true } //return updated user
        )

        if (!updateUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updateUser
        });

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error updating",
            Error: err
        })
    }
});

// Get user profile
const userProfileDetails = catchAsyncError(async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // const {userId} = req.params;
        // find the user by Id
        const profileData = await User.findOne({userId}).select('username bio profilePicture');
        //check if the user exists
        if (!profileData) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            id: userId,
            username: profileData.username,
            bio: profileData.bio,
            profilePicture: profileData.profilePicture
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error loading the user data",
            Error: err
        });
    }
})

// User logout
const logoutUser = catchAsyncError(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const newBlacklist = new blacklistModel({
            token: token,
        });

        await newBlacklist.save();
        res.setHeader('Clear-site-Data', '"cookies"');
        res.status(200).json({
            success: true,
            message: "You are logged out successfully",
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error logging out",
            Error: err
        });
    }
})


export { saveUser, userLogin, updateUser, userProfileDetails, logoutUser};