import User from '../models/user.model.js'
import {asyncHandler} from '../utilities/asyncHandler.utility.js';
import cloudinary from '../utilities/cloudinary.utilty.js';
import { errorHandler } from '../utilities/errorHandler.utility.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = asyncHandler(
    async (req, res, next) => {
        const { fullName, email, password, gender } = req.body;
        
        if (!fullName || !email || !password || !gender) {
           return next(new errorHandler("All fields are required", 400))
        }

        const user = await User.findOne({email});
        if(user) {
            return next(new errorHandler("User already exists", 400))
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            gender,
        })

        // Generate and send JWT
        const tokenData = {
            _id: newUser._id,
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201) // 201 for resource creation
        .cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true, // Always use secure cookies
            sameSite: 'none' // Changed from 'strict' for better security
        })
        .json({
            success: true, 
            message: 'Account created successfully!', 
            responseData: {
                user: userResponse, 
                token
            }
        })
    }
)

export const login = asyncHandler(
    async (req, res, next) => {
        // console.log(req.body)
        const { email, password } = req.body;
        
        if (!email || !password) {
           return next(new errorHandler("Email and password are required", 400))
        }

        // Include password in query for comparison, but exclude from response
        const user = await User.findOne({email}).select('+password');
        if(!user) {
            return next(new errorHandler("Invalid email or password", 401)) // 401 for unauthorized
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return next(new errorHandler("Invalid email or password", 401)) // 401 for unauthorized
        }

        // Generate and send JWT
        const tokenData = {
            _id: user._id,
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200)
        .cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Standardized to 7 days
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .json({
            success: true, 
            responseData: {
                message: "Login successful",
                user: userResponse, // Password excluded
                token
            }
        })
    }
)

export const getProfile = asyncHandler(
    async (req, res, next) => {
        const userId = req.user._id;

        const profile = await User.findById(userId).select("-password");

        if(!profile) {
            return next(new errorHandler("User not found!", 404)) // 404 for not found
        }
        
        res.status(200).json({
            success: true,
            responseData: profile
        });
    }
)

export const logout = asyncHandler(
    async (req, res, next) => {
        res.status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .json({
            success: true,
            message: "User logged out successfully"
        });
    }
)

export const getOtherUsers = asyncHandler(
    async (req, res, next) => {
        // Fetch all users except yourself, excluding passwords
        const otherUsers = await User.find({_id: { $ne: req.user._id}}).select("-password");
        
        res.status(200)
        .json({
            success: true,
            responseData: otherUsers
        });
    }
)

export const updateProfile = asyncHandler(
    async (req, res, next) => {
        const userId = req.user._id; 
        const { avatar, fullName, bio } = req.body; // Added fullName and bio support
        
        const updateData = {};

        // Handle avatar update
        if (avatar) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(avatar);
                updateData.avatar = uploadResponse.secure_url;
            } catch (error) {
                return next(new errorHandler("Failed to upload image", 500));
            }
        }

        // Handle other profile updates
        if (fullName) updateData.fullName = fullName;
        if (bio !== undefined) updateData.bio = bio; // Allow empty string

        if (Object.keys(updateData).length === 0) {
            return next(new errorHandler("Please provide data to update", 400));
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return next(new errorHandler("User not found!", 404));
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            responseData: updatedUser
        });
    }
)

export const deleteUser = asyncHandler(
    async (req, res, next) => {
        const userId = req.user._id; 

        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return next(new errorHandler("User not found!", 404))
        }

        // Clear the authentication cookie
        res.status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .json({
            success: true,
            message: "Account deleted successfully",
        });
    }
)

export const updatePassword = asyncHandler(
    async (req, res, next) => {
        const userId = req.user._id; 
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new errorHandler("Please provide old and new passwords", 400))
        }

        // Add password validation
        if (newPassword.length < 6) {
            return next(new errorHandler("New password must be at least 6 characters long", 400))
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return next(new errorHandler("User not found!", 404))
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return next(new errorHandler("Current password is incorrect", 400))
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
)