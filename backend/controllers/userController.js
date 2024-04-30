// libraries
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import userTemplate from '../templates/userTemplate.js';


// registration function
export const register = async (req, res) => {

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
};


// login function
export const login = async (req, res) => {
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
};


// about user function
export const getUserInfo = async (req, res) => {
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
};