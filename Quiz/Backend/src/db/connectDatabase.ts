import mongoose from "mongoose"

export const connect_db =()=>{

    mongoose.connect('mongodb+srv://shubhamtempacc:kjkszpj@cluster0.dzumnro.mongodb.net/quiz?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((error)=>{
        console.log(error);
    })
}
