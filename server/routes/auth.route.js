import express from 'express'
import { login, logout, profile, signup, updateProfilePicture } from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import upload from '../middlewares/multer.config.js'
const router = express.Router()

router.get('/profile', verifyToken, profile)
router.patch('/update-profile', verifyToken, upload.single('profilePicture'), updateProfilePicture) 
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)



export default router 