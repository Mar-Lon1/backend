// import express
const express = require('express');

//import mongoose
const mongoose = require("mongoose");

//import dotenv
require('dotenv').config();

// create the server
const server = express();
const cors = require('cors');

// Allow requests from any origin (update ALLOWED_ORIGIN env var on Render to restrict)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
server.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

//Port Number
const PORT = process.env.PORT || 3000;

//MONGO Connection string
const MONGO_URL = process.env.MONGO_URL;

//middleware
server.use(express.json());

// Health check endpoint — visit /health on Render to confirm status
server.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.status(dbState === 1 ? 200 : 503).json({
        status: dbState === 1 ? 'ok' : 'degraded',
        database: states[dbState] || 'unknown',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

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

if (!MONGO_URL) {
    console.error("FATAL: MONGO_URL environment variable is not set. Database will not connect.");
} else {
    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log(`Mongo DB connected successfully`);
        })
        .catch((err) => {
            console.error("Failed to connect to MongoDB at startup:", err.message);
            // Do not process.exit(1) — let the server run so Render health checks pass.
        });
}

// Centralized error handler
server.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
});
