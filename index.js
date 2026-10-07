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

// Start and listen to the server FIRST so deployment health checks pass
server.listen(PORT, () => {
    console.log(`Server just started on port ${PORT}`);
});

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log(`Mongo DB connected successfully`);
    })
    .catch((err)=>{
        console.error("Failed to connect to MongoDB at startup:", err);
        // Do not process.exit(1) here, otherwise deployment platforms will mark the build as failed.
        // The server is running and will return 500 errors via the centralized handler.
    });

// Centralized error handler
server.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
});

//import controller




