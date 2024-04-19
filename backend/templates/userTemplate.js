import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    
    userPasswordHash: {
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