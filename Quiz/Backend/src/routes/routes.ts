
import express from "express";
import { getCurrentUser, login, signup } from "../controllers/authContoller";
import { verifyToken } from "../middlewares/authenticate";


const router = express.Router();

router.post("/login",login);
router.post("/signup",signup);
router.get("/currentUser",verifyToken,getCurrentUser);

export {router as allRoutes}