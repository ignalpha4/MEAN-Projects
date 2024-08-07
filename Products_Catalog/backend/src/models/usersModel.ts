import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        required:true,
    },
    profileImage:{
        type:String,
    }
})


userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        return next()
    }
    try {
        const encPassword = await bcrypt.hash(this.password, 10)
        this.password = encPassword
        next()
    } catch (error: any) {
        next(error)
    }
})


const user =  mongoose.model('user',userSchema);

export default user;