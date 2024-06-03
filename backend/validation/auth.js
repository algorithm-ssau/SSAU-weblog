import { body } from "express-validator";

export const registerValidation = [
    body('userName').isLength({ min: 2 }).withMessage("User Name must be at least 2 characters long"),
    body('userSurname').isLength({ min: 2 }).withMessage("User Surname must be at least 2 characters long"),
    body('userNickname').isLength({ min: 5 }).withMessage("User Nickname must be at least 5 characters long"),
    body('userEmail').isEmail().withMessage("Must be a valid email address"),
    body('userPassword').isLength({ min: 8 }).withMessage("User Password must be at least 8 characters long"),
    body('userPassword').matches(/\d/).withMessage("User Password must contain a number"),
    body('userPassword').matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("User Password must contain a special character"),
    body('userGender').isString().withMessage("User Gender must be a valid string"),
    body('userAvatarUrl').optional().isURL().withMessage("User Avatar URL must be a valid URL if provided"),
    // Дополнительная проверка на соответствие пароля и подтверждения пароля
    body('userPasswordConfirmation').custom((value, { req }) => {
        if (value !== req.body.userPassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
];

export const loginValidation = [
    body('userEmail').isEmail().withMessage("Must be a valid email address"),
    body('userPassword').isLength({ min: 8 }).withMessage("User Password must be at least 8 characters long"),
    // Дополнительная проверка на соответствие пароля и подтверждения пароля
    body('userPasswordConfirmation').custom((value, { req }) => {
        if (value !== req.body.userPassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
];