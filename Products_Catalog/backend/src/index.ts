import 'reflect-metadata';
import express from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { connect_db } from "./db/connectDatabase";
import path from 'path';
import cors from 'cors';
import {config} from 'dotenv';
import { container } from './inversify.config';

config();
connect_db();


const PORT =  process.env.PORT || 5000;
const app = new InversifyExpressServer(container);

app.setConfig((app:express.Application)=>{
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(cors())
    app.use(express.json({ limit: '10mb' })); 
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
})


app.build().listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})