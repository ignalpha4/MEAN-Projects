import express from "express";
import { allRoutes } from "./src/routes/routes";
import { connect_db } from "./src/db/connectDatabase";
import bodyParser from "body-parser";
import path from 'path';
import cors from 'cors';

const app = express();
const PORT =  6000;


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

connect_db();

app.use(cors());

app.use('/user',allRoutes);

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})