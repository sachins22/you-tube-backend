// require('dotenv').config({path: "./env"})
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
        path: './env'
})

connectDB()
.then(
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`\n ⚙️  App is listening on port ${process.env.PORT}`)
    })
)
.catch ((error) => {
    console.log("MONGODB connection FAILED : ", error);
})





/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants"
import express from "express";

//? first approach 

// function connectDB (){}
// connectDB()

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        express.on("error", (error)=>{
            console.log("Error: ", error);
            throw error;
        });

        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port 
            ${process.env.PORT}`)
        });

    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
})();

*/