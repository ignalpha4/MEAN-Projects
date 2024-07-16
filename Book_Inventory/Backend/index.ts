import express from "express"
import { allRoutes } from "./src/routes/routes";
import { connect_db } from "./src/db/connect_db";
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';


const app =  express();
const PORT = 5000;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//database connection
connect_db()

app.use(cors())
//routes
app.use("/user",allRoutes);

app.listen(PORT,()=>{
    console.log(`Server Running On PORT ${PORT} !`);
})

