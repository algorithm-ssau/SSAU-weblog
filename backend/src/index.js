// import libraries
import express from "express";
import config from "config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import { registerValidation } from '../validation/auth.js';

// defaults
const PORT = config.get('port') || 5000;

// creating express application
const app = express();
app.use(express.json());

// get 
app.get("/", (req, res) => {
    res.send("Home Page is loaded!");
});

// post register
app.post("/auth/register", registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    res.json({ success: true, });
});

// post login
app.post("/auth/login", (req, res) => {
    res.send("Log-In Page is loaded!");
});

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {

        })
        .then(() => console.log("DataBase connected."))
        .catch((err) => console.log("DataBase connection error: ", err));
        
    } catch (err) {
        console.log("Server Error: ", err.message);
        process.exit(1);
    }
}

start();

// launch express application
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server is running.");
});