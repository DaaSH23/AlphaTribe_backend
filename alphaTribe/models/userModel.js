import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    username: {
        type: String,
        required: [true, "Username is requiered"],
        max: 50, 
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        index: {unique: true, message: "Email already registered"},
    },
    password: {
        type: String,
        required: [true, "Password must be provided"],
        select: true,
    },
    bio: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

export const User = mongoose.model("users", userSchema);