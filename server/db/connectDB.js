import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log("Database connecton successfull", conn.connection.host)
    } catch (error) {
        console.log("Error in datbase connection", error.message)
        process.exit(1)
    }
} 