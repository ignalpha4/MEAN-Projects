import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";


const userSchema = new mongoose.Schema<IUser>({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    profileImage: {
        type: String
    }
});

const user = mongoose.model('user', userSchema);

export default user;
