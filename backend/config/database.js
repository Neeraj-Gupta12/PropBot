import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.URL;

const connectDB = async ()=>{
    try {
        const con = await mongoose.connect(URL);
        console.log("Connected: ",con.connection.host);
    } catch (error) {
        console.log("Error: ",error);
    }
}

export default connectDB;
