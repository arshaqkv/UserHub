import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/connectDB.js'
import authRoutes from './routes/auth.route.js'
import adminRoutes from './routes/admin.route.js'
import cors from 'cors'
import morgan from 'morgan'
import multerErrorHandler from './middlewares/multer.errorHandler.js'
import path from 'path'

dotenv.config()
const app = express()
const __dirname = path.resolve()
app.use('/server/uploads', express.static('server/uploads'));

app.use(express.json()) 

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})
)
app.use(morgan('tiny'))

app.use('/api/auth', authRoutes)
app.use('/admin', adminRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "/client/dist")))
    app.get("*", (req, res) =>{
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}

app.use(multerErrorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    connectDB() 
    console.log(`Server running at  http://localhost:${PORT}`)
})