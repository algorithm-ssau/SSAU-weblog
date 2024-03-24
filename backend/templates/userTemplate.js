import mongoose from "mongoose";

const userSchema = new mongoose.userSchema({
    userName: {
        type: String,
        required: true,
    },
    
    userSurname: {
        type: String,
        required: true,
    },
    
    userNickname: {
        type: String,
        required: true,
        unique: true,
    },
    
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    
    userPassword: {
        type: String,
        required: true,
    },
    
    userPasswordConfirmation: {
        type: String,
        required: true,
    },

    userGender: {
        type: String,
        required: true,
    },

    userAvatarUrl: String,

    }, 
    {
        timestamps: true,
    },
);

export default mongoose.model('user', userSchema);