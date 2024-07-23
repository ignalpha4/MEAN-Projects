import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDatabase from "./src/db/connect_database";
import router from "./src/routes/adminRoutes";
import config from "config"
const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDatabase();

app.use("/", router);

const port = config.get("PortNumber")


app.listen(port, () => console.log(`Server running on port ${port}`));
