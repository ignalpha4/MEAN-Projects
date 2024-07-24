import { Request, Response } from "express";
import Seat from "../models/seatsmodel";

export const availableSeats = async (req: Request, res: Response) => {
  try {
    const { busId, date } = req.params;
    console.log("the date we got", date);
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.json({ success: false, message: "Invalid date format" });
    }

    console.log(busId);
    
    const busSeat = await Seat.findOne({ busId, date: parsedDate });

    if (!busSeat) {
      console.log("Seats not found");
      return res.json({ success: false, message: "Seats not found" });
    }

    return res.json({ success: true, busSeats: busSeat.seats });
  } catch (error) {
    console.error("Error fetching available seats:", error);
    res.json({
      success: false,
      message: "Failed to fetch available seats",
      error,
    });
  }
};

export const updateSeatStatus = async (req: Request, res: Response) => {
  try {
    const { busId, seatId, seatNumber, gender } = req.body;

    console.log("Updating seat status for bus:", busId, "seat ID:", seatId, "seat number:", seatNumber);

 
    if (!busId || !seatId || seatNumber === undefined) {
      return res.status(400).json({ success: false, message: "Bus ID, seat ID, and seat number are required" });
    }

    console.log("Gender is:", gender);


    const update = gender === "female"
      ? { "seats.$.isBooked": true, "seats.$.isFemale": true }
      : { "seats.$.isBooked": true };

    const seat = await Seat.findOneAndUpdate(
      { busId, "seats._id": seatId, "seats.number": seatNumber },
      { $set: update },
      { new: true }
    );

    console.log("Updated seat status:", seat);

    if (!seat) {
      return res.status(404).json({ success: false, message: "Unable to update the status" });
    }

    return res.json({ success: true, seat: seat });
  } catch (error) {
    console.error("Error updating seat status:", error);
    return res.status(500).json({ success: false, message: "An error occurred while updating seat status" });
  }
};