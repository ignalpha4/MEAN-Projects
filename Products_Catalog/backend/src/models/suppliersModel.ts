import mongoose from "mongoose";
export const supplierSchema = new mongoose.Schema({
    
    S_Name:{
        type:String,
        required:true,
    },
    S_Contact:{
        type:String,
        required:true
    },
    S_Address:{
        type:String,
        required:true
    }
})


const supplier =  mongoose.model('supplier',supplierSchema);

export default supplier;