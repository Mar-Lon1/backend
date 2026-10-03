// import express
const express = require('express');

//import mongoose
const mongoose=require("mongoose");

//import dotenv
require('dotenv').config();

// create the server
const server = express();
const cors = require('cors');
server.use(cors());

//Port Number
const PORT = process.env.PORT || 3000;

//MONGO Connection string
const MONGO_URL=process.env.MONGO_URL;

//middleware
server.use(express.json());

//import the router
const usersRoutes = require("./Routes/usersRoutes")
const authRoutes = require("./Routes/authRoutes")

//register router
server.use(usersRoutes)
server.use(authRoutes)



mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected!');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log(`Mongo DB connected successfully on ${PORT}`)
        
        //Start and listen to the server
        server.listen(PORT, () => {
            console.log(`Hey my server just started 3000`)
        })
    })
    .catch((err)=>{
        console.error("Failed to connect to MongoDB at startup:", err);
        process.exit(1);
    })

// Centralized error handler
server.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
});

//import controller




