//import express
const express = require('express');


const router = express.Router()
//import controller
const {register} = require('../Controllers/authController');

//register route
router.post("/signup",register);

module.exports = router;

