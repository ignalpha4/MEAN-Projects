
import mongoose from "mongoose";
import bookingModel from "../models/bookingmodel";
import busModel from "../models/busesmodel";
import { Request,Response } from "express";

export const availableSeats = async (req: Request, res: Response) => {
  try {
    const { busId, date, from, to, gender } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Incorrect date format" });
    }

    const bus = await busModel.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "No bus found" });
    }

    const stops = bus.stops.map((stop) => stop.station);
    let fromIndex = stops.indexOf(from);
    let toIndex = stops.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) {
      return res.status(400).json({ success: false, message: "Invalid route" });
    }

    let bookedSeats = new Set<number>();
    const bookings = await bookingModel.find({
      bus: new mongoose.Types.ObjectId(busId),
      date: {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(24, 0, 0, 0))
      }
    });

    bookings.forEach((booking) => {
      const bookingFromIndex = stops.indexOf(booking.from);
      const bookingToIndex = stops.indexOf(booking.to);

      if ((bookingFromIndex <= fromIndex && bookingToIndex > fromIndex) ||
          (bookingFromIndex < toIndex && bookingToIndex >= toIndex) ||
          (bookingFromIndex >= fromIndex && bookingToIndex <= toIndex)) {
        bookedSeats.add(booking.seatNumber);
      }
    });

    const allSeats = Array.from({ length: bus.seatingCapacity }, (_, i) => i + 1);
    let availableSeats = allSeats.filter(seat => !bookedSeats.has(seat));

    console.log(gender);
    
    if (gender === 'male') {
      availableSeats = availableSeats.filter(seat => {
        if (seat % 2 === 1) { 
          return !bookedSeats.has(seat + 1); 
        }
        if (seat % 2 === 0) { 
          return !bookedSeats.has(seat - 1); 
        }
        return true;
      });
    }

    console.log(availableSeats);
    return res.json({ success: true, availableSeats });

    
  } catch (error) {
    console.error("Error fetching available seats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch available seats", error });
  }
};

export const bookSeat = async (req: any, res: any) => {
  try {
    const {
      userId,
      busId,
      from,
      to,
      date,
      seatNumber,
      paymentType,
      totalFare,
      gender
    } = req.body;

    const requiredFields = ["userId", "busId", "from", "to", "date", "seatNumber", "paymentType", "totalFare"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const bus = await busModel.findById(busId);

    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }


    const newBooking = new bookingModel({
      userId,
      bus: busId,
      from,
      to,
      date,
      seatNumber,
      paymentType,
      totalFare,
      gender
    });

    await newBooking.save();
    res.json({ success: true, message: 'Seat booked successfully' });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ success: false, message: "Failed to book seat", error });
  }
};