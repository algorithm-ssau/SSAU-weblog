import { body } from "express-validator";

export const postCreateValidation = [
    body('postTitle').isLength({min: 3}).isString().withMessage("Must be a must be at least 3 characters long"),
    body('postText').isLength({min: 10}).isString().withMessage("Must be a must be at least 10 characters long"),
    body('postTags').optional().isArray().withMessage("Wrong tag format"),
    body('postImageUrl').optional().isURL().withMessage("Post image URL must be a valid URL if provided"),
       
];