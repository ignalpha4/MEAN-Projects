import express from "express";
import { createRoute, getRoutes, getRoutesById } from "../controllers/routeController";
import { addBus, filteredBuses, getBusById, getBuses } from "../controllers/busController";
import { getCurrentUser, login, signup } from "../controllers/userController";
import { availableSeats, bookSeat } from "../controllers/bookingsController";
import { verifyToken } from "../middlewares/authentication";

const router = express.Router();

//user mgmt
router.post("/signup", signup);
router.post("/login", login);
router.get("/currentUser", verifyToken, getCurrentUser);


//routes mgmt
router.post("/create", createRoute);
router.get("/getRoutes", getRoutes);
router.get("/getRouteById/:id", getRoutesById);
router.get("/availableSeats/:busId/:date/:from/:to/:gender",availableSeats)

//bus mgmt
router.post("/add", addBus);
router.get("/getBuses", getBuses);
router.get("/getBusById/:id",getBusById);
router.post("/booking", bookSeat);
router.get('/filteredBuses',filteredBuses);


export default router;
