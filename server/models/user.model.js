import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        role: {
            type: String,
            default: 'user'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        profilePicture: {
            type: String,
            default: ''
        },
        verificationToken: String,
        verificationTokenExpiresAt: Date
    },
    {
        timestamps: true //automatically add createdAt and updatedAt fields
    }
)

export const User = mongoose.model('User', userSchema) 