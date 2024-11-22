import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/generateToken.js"

export const adminLogin = async (req, res) =>{
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }        
        const admin = await User.findOne({email})
        if(!admin){
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }  
 
        if(admin.role !== 'admin'){ 
            return res.status(403).json({success: false, message: "You are not an admin"})
        }
        generateToken(res, admin._id) 
        const {password: _, ...admindata} = admin._doc
        return res.status(200).json({success: true, message: "Logged in successfully", admin: admindata})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    } 
}

export const createUser = async (req, res) =>{
    const { username, email, password } = req.body
    try {
        const userAlreadyExists = await User.findOne({email})
        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            username, 
            email,
            password: hashedPassword
        })
        if(req.file){
            user.profilePicture = `/uploads/profilePictures/${req.file.filename}`
        }
        await user.save()
        res.status(201).json({
            success: true,
            message: "User created successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const getAllUsers = async (req, res) =>{
    try {
        const users = await User.find({role: 'user'}) 
        const userWithoutPassword = users.map(user =>{
            const {password, ...userData} = user._doc
            return userData
        })
        return res.status(200).json({ success: true, users: userWithoutPassword })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const editUser = async (req, res) =>{
    const { id } = req.params
    const { username, email, password } = req.body
    try {
        const user = await User.findById({_id: id})
        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        }
        if(email && email !== user.email){
            const emailExist = await User.findOne({email})
            if(emailExist){
                return res.status(400).json({success: false, message: "Email already in use"})
            }
            user.email = email
        }
        if(password){
            const hashedPassword =  await bcrypt.hash(password, 10)
            user.password = hashedPassword
        }
        if(username){
            user.username = username
        }
        if(req.file){
            user.profilePicture = `/uploads/profilePictures/${req.file.filename}`
        }
        const updatedUser = await user.save()
        const {password: _, ...updatedUserData} = updatedUser._doc
        return res.status(200).json({success: true, message: "User Updated Successfully", user: updatedUserData})
    } catch (error) {
        console.log(error.message) 
        return res.status(500).json({success: false, message: error.message})
    }
}

export const getEditUser = async(req, res) =>{
    const {id} = req.params
    try {
        const user = await User.findById({_id: id}).select('-password');
        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        }
        return res.status(200).json({user});
    } catch (error) {
        console.log(error.message) 
        return res.status(500).json({success: false, message: error.message})
    }
}
 
export const deleteUser = async (req, res)=>{
    const { id } = req.params
    try {
        const deletedUser = await User.findByIdAndDelete({_id: id})
        if(!deletedUser){
            return res.status(400).json({success: false, message: "User not found"})
        }
        return res.status(200).json({success: true, message: "User deleted successfully"})
    } catch (error) {
        console.log(error.message) 
        return res.status(500).json({success: false, message: error.message})
    }
}