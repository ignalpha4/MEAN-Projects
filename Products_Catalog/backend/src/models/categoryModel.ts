import mongoose from "mongoose";
export const categorySchema = new mongoose.Schema({

    C_Name:{
        type:String,
        required:true
    },
})


const category =  mongoose.model('category',categorySchema);

export default category;