import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT;

connectDB();

app.listen(PORT,()=>{
    console.log("Running on PORT: ",PORT);
})