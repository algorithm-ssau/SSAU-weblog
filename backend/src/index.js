// import libraries
import express from "express";
import config from "config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import { registerValidation } from '../validation/auth.js';
import userTemplate from '../templates/userTemplate.js';
import checkAuth from '../utilties/checkAuth.js';

// defaults
const PORT = config.get('port') || 5000;

// creating express application
const app = express();
app.use(express.json());

// homepage 
app.get("/", (req, res) => {
    res.send("Home Page is loaded!");
});

// register
app.post("/auth/register", registerValidation, async (req, res) => {
    // user data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    
    // user registration
    try {
        const userPassword = req.body.userPassword;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userPassword, salt);

        const doc = new userTemplate({
            userName: req.body.userName,
            userSurname: req.body.userSurname,
            userNickname: req.body.userNickname,
            userEmail: req.body.userEmail,
            userPasswordHash: hash,
            userGender: req.body.userGender,
            userAvatarUrl: req.body.userAvatarUrl
        });

        // creating user in db
        const user = await doc.save();

        // token
        const token = jwt.sign({
            _id: user._id,
        }, 
        "tokenCrypt",
        {
            expiresIn: "30d",
        });

        // response
        const { userPasswordHash, ... userData } = user._doc;
        res.json({ 
            ... userData,
            token,
        });
        
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрировать пользователя",
        });
    }
});

// login
app.post("/auth/login", async (req, res) => {
    try {
        // email check
        const user = await userTemplate.findOne({ userEmail: req.body.userEmail });
        if (!user) {
            return res.status(404).json({
                message: "Неверный логин или пароль",
            });
        }

        // password check
        const isValidPassword = await bcrypt.compare(req.body.userPassword, user._doc.userPasswordHash);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        // token
        const token = jwt.sign({
            _id: user._id,
        }, 
        "tokenCrypt",
        {
            expiresIn: "30d",
        });

        // response
        const { userPasswordHash, ... userData } = user._doc;
        res.json({ 
            ... userData,
            token,
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }    
});

// user personal page
app.get("/auth/me", checkAuth, async (req, res) => {
    try {
        // try to find user in DB
        const user = await userTemplate.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        // response
        const { userPasswordHash, ... userData } = user._doc;
        res.json({
            userData
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
})

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