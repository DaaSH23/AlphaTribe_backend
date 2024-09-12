import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();
// const app = express();

const PORT = process.env.PORT || 5001;

// Connection to database
connectDB();

app.listen(5000, ()=>{
    console.log(`Server running on port ${PORT}`)
});
