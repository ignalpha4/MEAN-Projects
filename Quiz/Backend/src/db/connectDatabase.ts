import mongoose from "mongoose"
import {config} from "dotenv";

config();

const URL =  process.env.DBurl as string;

export const connect_db =()=>{

    mongoose.connect(URL)
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((error)=>{
        console.log(error);
    })
}
