
import express from "express";
import { getAllUsers, getCurrentUser, login, signup } from "../controllers/authContoller";
import { verifyToken } from "../middlewares/authenticate";


const router = express.Router();

router.post("/login",login);
router.post("/signup",signup);
router.get("/currentUser",verifyToken,getCurrentUser);
router.get("/getAllUsers",getAllUsers);

export {router as allRoutes}