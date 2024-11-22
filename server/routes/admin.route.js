import express from 'express'
import { adminLogin, createUser, deleteUser, editUser, getAllUsers, getEditUser } from '../controllers/admin.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { isAdmin } from '../middlewares/roleMiddleware.js'
import upload from '../middlewares/multer.config.js'
const router = express.Router()

router.post('/', adminLogin)
router.get('/dashboard', verifyToken, isAdmin, getAllUsers)
router.post('/add-user', verifyToken, isAdmin, upload.single('profilePicture'), createUser)
router.get('/edit-user/:id', verifyToken, isAdmin, getEditUser)
router.put('/edit-user/:id', verifyToken, isAdmin, upload.single('profilePicture'), editUser)
router.delete('/delete-user/:id', verifyToken, isAdmin, deleteUser)

export default router