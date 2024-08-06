import mongoose from "mongoose"
import {config} from "dotenv";
import { seedAdminUser } from "../utils/seedAdmin";

config();

const URL =  process.env.DBurl as string;

export const connect_db =()=>{

    mongoose.connect(URL)
    .then(()=>{
        console.log("Connected to Database");
        seedAdminUser()
    })
    .catch((error)=>{
        console.log(error);
    })
}
