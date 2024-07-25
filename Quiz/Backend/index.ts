import express from "express";
import { allRoutes } from "./src/routes/routes";
import { connect_db } from "./src/db/connectDatabase";
import bodyParser from "body-parser";
const app = express();
const PORT =  6000;

connect_db();
app.use(bodyParser.json({ limit: '10mb' })); 
app.use('/user',allRoutes);

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})