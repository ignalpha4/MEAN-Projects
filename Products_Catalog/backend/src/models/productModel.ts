import mongoose from "mongoose";
export const productSchema = new mongoose.Schema({
    
    P_Name:{
        type:String,
        required:true,
    },
    P_Category:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'category', 
        required: true
    },
    P_Price:{
        type:Number,
        required:true
    },
    P_Supplier:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'supplier',
        required:true
    },
    P_Image:{
        type:String,
    },
    P_Desc:{
        type:String
    }
})


const product =  mongoose.model('product',productSchema);

export default product;