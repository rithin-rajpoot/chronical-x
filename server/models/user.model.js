import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {  // Changed from username to match controller
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  avatar: {  // Changed from profileImage to match controller
    type: String, // Cloudinary URL
    default: ""
  },
  gender: {  // Added to match controller registration
    type: String,
    enum: ['male', 'female', 'other']
  },
  bio: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);