import mongoose from "mongoose";

export const connect_db = ()=>{
    mongoose
  .connect(
    "mongodb+srv://shubhamtempacc:kjkszpj@cluster0.dzumnro.mongodb.net/game?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
}