// import libraries
import express from "express";
import config from "config";
import mongoose from "mongoose";
import cors from "cors";

// import functions
import { registerValidation, loginValidation } from '../validation/auth.js';
import { postCreateValidation} from '../validation/post.js';
import checkAuth from '../utilities/checkAuth.js';
import * as userController from '../controllers/userController.js';
import * as postController from '../controllers/postController.js';

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
app.post("/auth/register", registerValidation, userController.register);

// login
app.post("/auth/login", loginValidation, userController.login);

// user personal page
app.get("/auth/me", checkAuth, userController.getUserInfo)

//POSTS
// get all
app.get("/posts", postController.postsGetAll);
app.get("/posts/:id", postController.postsGetOne);
app.post("/posts", checkAuth, postCreateValidation, postController.postsCreate);
app.delete("/posts/:id", checkAuth, postController.postsDeleteOne);
app.patch("/posts/:id", postController.postsUpdateOne);

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