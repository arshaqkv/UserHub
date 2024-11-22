import { User } from "../models/user.model.js"

export const isAdmin = async (req, res, next) =>{
    const admin = await User.findById(req.userId)
    if(admin.role !== 'admin'){
        return res.status(403).json({success: false, message: "Access denied"})
    }
    next()
}