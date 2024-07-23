import { Request, Response } from "express";
import Seat from "../models/seatsmodel";
import { AnyArray } from "mongoose";

export const availableSeats = async (req: Request, res: Response) => {
  try {
    const { busId, date } = req.params;
    console.log("the date we got", date);
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.json({ success: false, message: "Invalid date format" });
    }

    console.log(busId);
    
    const seats = await Seat.find({ busId, date: parsedDate });

    if (!seats) {
      console.log("Seats not found");
      return res.json({ success: false, message: "seats not found" });
      
    }

    return res.json({ success: true, seats });
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
    const { seatId,gender } = req.body;

    console.log("Updating seat status for:", seatId);


    if (!seatId) {
      return res
        .status(400)
        .json({ success: false, message: "Seat ID is required" });
    }

    let seat:any;
    console.log("gender is :",gender);
    
    if (gender == "female") {
        seat = await Seat.findByIdAndUpdate(
        seatId,
        { isBooked: true,isFemale:true},
        { new: true }
      );
    }else{
      seat = await Seat.findByIdAndUpdate(
        seatId,
        { isBooked: true},
        { new: true }
      );
    }


    console.log("Updated seat:", seat);

    if (!seat) {
      return res
        .status(404)
        .json({ success: false, message: "Seat not found" });
    }

    if (!seat.isBooked) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update seat status" });
    }

    return res.json({ success: true, seat });
  } catch (error) {
    console.error("Error updating seat status:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while updating seat status",
      });
  }
};
