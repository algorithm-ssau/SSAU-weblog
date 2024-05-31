// import libraries
import express from "express";
import config from "config";
import mongoose from "mongoose";
import cors from "cors";

// import functions
import { registerValidation } from '../validation/auth.js';
import checkAuth from '../utilities/checkAuth.js';
import { register, login, getUserInfo } from '../controllers/userController.js';

// defaults
const PORT = config.get('port') || 4444;

// creating express application
const app = express();
app.use(cors());
app.use(express.json());

// homepage 
app.get("/", (req, res) => {
    res.send("Home Page is loaded!");
});

// register
app.post("/auth/register", registerValidation, register);

// login
app.post("/auth/login", login);

// user personal page
app.get("/auth/me", checkAuth, getUserInfo)

// start project function
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