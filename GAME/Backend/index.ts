
import bodyParser from 'body-parser';
import express from 'express';
import { allroutes } from './src/routes/routes';
import { connect_db } from './src/db/connectDatabase';
import cors from 'cors';
import path from 'path'

const app  = express();
const PORT = 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

connect_db()

app.use(cors())

app.use('/user',allroutes);

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}!`);
})

