import mongoose, { Mongoose } from "mongoose";

export const connect_db =()=>{
    mongoose.connect("mongodb+srv://shubhamtempacc:kjkszpj@cluster0.dzumnro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("Connected To DB");
    })
    .catch((error)=>{
        console.log(error);
    })
}

