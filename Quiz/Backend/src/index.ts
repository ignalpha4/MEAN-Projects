import 'reflect-metadata';
import express from "express";
import { connect_db } from "./db/connectDatabase";
import bodyParser from "body-parser";
import path from 'path';
import cors from 'cors';
import {config} from 'dotenv';
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from './inversify.config';

config();
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

const PORT =  process.env.PORT || 5000;
const app = new InversifyExpressServer(container);

app.setConfig((app:express.Application)=>{

    app.use(cors())

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(bodyParser.json({ limit: '10mb' })); 
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
})

connect_db();

app.build().listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})