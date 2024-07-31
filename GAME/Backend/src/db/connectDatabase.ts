import mongoose from "mongoose";
import {config} from 'dotenv';

config()

export const connect_db = ()=>{
    mongoose
  .connect(
     process.env.dbURL as string
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
}