import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js'

export const signup = async (req, res)=> {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }    
        const userAlreadyExists = await User.findOne({email})
        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            username,
            email,
            password: hashedPassword,
        })
        await user.save()

        //jwt 
        generateToken(res, user._id)
        res.status(201).json({
            success: true,
            message: "User created successfully",
        })
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const login = async (req, res)=> {
    const { email, password } =  req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }    
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }
        generateToken(res, user._id)
        const {password: _, ...userData} = user._doc
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const logout = async (req, res)=> {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
    res.json({success: true, message: "Logged out succussfully"})
}

export const profile = async (req, res)=>{
    const user = await User.findById(req.userId).select('-password')
    try {
        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        }
        res.status(200).json({success: true, user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

export const updateProfilePicture = async (req, res) =>{
    try {
        const userId = req.userId
        const user = await User.findById({_id: userId})
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.profilePicture = `/uploads/profilePictures/${req.file.filename}`
        await user.save()

        const updatedUser = user.toObject()
        delete updatedUser.password
        res.status(200).json({success: true, message: "Profile updated", user: updatedUser})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
}