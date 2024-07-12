import mongoose, { Mongoose } from "mongoose";

export const connect_db =()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/Book_Inventory")
    .then(()=>{
        console.log("Connected To DB");
    })
    .catch((error)=>{
        console.log(error);
    })
}

