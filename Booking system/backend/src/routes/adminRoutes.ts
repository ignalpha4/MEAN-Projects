import express from "express";
import { createRoute, getRoutes, getRoutesById } from "../controllers/routeController";
import { addBus, addSeats, filteredBuses, getBusById, getBuses } from "../controllers/busController";
import { getCurrentUser, login, signup } from "../controllers/userController";
import { bookSeat } from "../controllers/bookingsController";
import { verifyToken } from "../middlewares/authentication";
import { availableSeats, updateSeatStatus } from "../controllers/seatsController";

const router = express.Router();

//user mgmt
router.post("/signup", signup);
router.post("/login", login);
router.get("/currentUser", verifyToken, getCurrentUser);


//routes mgmt
router.post("/create", createRoute);
router.get("/getRoutes", getRoutes);
router.get("/getRouteById/:id", getRoutesById);

//bus mgmt
router.post("/add", addBus);
router.get("/getBuses", getBuses);
router.get("/getBusById/:id",getBusById);
router.post("/booking", bookSeat);
router.get('/filteredBuses',filteredBuses);


//seats mgmt
router.get('/availableSeats/:busId/:date',availableSeats);
router.post('/updateSeatStatus',updateSeatStatus)
router.post('/addSeats',addSeats);

export default router;
