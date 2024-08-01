import 'reflect-metadata';
import express from 'express';
import { connect_db } from './db/connectDatabase';
import cors from 'cors';
import path from 'path';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config';
import { config } from 'dotenv';

config()

connect_db();

const PORT =  process.env.PORT || 5000;

const server = new InversifyExpressServer(container);

server.setConfig((app: express.Application) => {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
});


server.build().listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
