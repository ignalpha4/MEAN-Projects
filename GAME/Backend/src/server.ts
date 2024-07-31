import 'reflect-metadata';
import bodyParser from 'body-parser';
import express from 'express';
import { connect_db } from './db/connectDatabase';
import cors from 'cors';
import path from 'path';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config';

const PORT = 5000;
const server = new InversifyExpressServer(container);

server.setConfig(app=>{

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(bodyParser.json({ limit: '10mb' })); 
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    app.use(cors())

    // app.use('/user',allroutes); 
})


connect_db()


server.build().listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

