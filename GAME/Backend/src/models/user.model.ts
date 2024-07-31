import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcrypt";

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


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
  })
  
userSchema.pre('findOneAndUpdate', async function (next) {
    const update: any = this.getUpdate()
    if (update.password) {
      const salt = await bcrypt.genSalt(10)
      update.password = await bcrypt.hash(update.password, salt)
    }
    next()
  })

const user = mongoose.model('user', userSchema);

export default user;
