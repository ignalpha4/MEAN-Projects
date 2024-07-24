
import mongoose from "mongoose";
import bookingModel from "../models/bookingmodel";
import busModel from "../models/busesmodel";


export const availableSeats = async (req: any, res: any) => {
  try {
    const { busId, date, from, to } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "incorrect date format" });
    }

   
    const bus = await busModel.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "no bus found" });
    }

  
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const stops = bus.stops.map((stop) => stop.station);
    console.log("stops array:", stops);

    let fromIndex = stops.indexOf(from);
    let toIndex = stops.indexOf(to);

    let bookedSeats: any[] = [];

    for (let i = fromIndex; i <= toIndex; i++) {
      for (let j = i + 1; j <= toIndex; j++) {
        const pipeline = [
          {
            $match: {
              bus: new mongoose.Types.ObjectId(busId),
              date: { $gte: startOfDay, $lte: endOfDay },
              from: stops[i],
              to: stops[j]
            }
          },
          {
            $group: {
              _id: null,
              seatNumbers: {
                $push: "$seatNumber"
              }
            }
          },
          {
            $project: {
              _id: 0,
              seatNumbers: 1
            }
          }
        ];

        const result = await bookingModel.aggregate(pipeline);
  
        if (result.length > 0 && result[0].seatNumbers !== undefined) {
          bookedSeats = bookedSeats.concat(result[0].seatNumbers);
        }
      }
    }

    console.log("total seaats boooked:", bookedSeats);

    const allSeats = Array.from({ length: bus.seatingCapacity }, (_, i) => i + 1);
    
    console.log("total seats:", allSeats);
  
    const availableSeats = allSeats.filter((seat) => !bookedSeats.includes(seat));

    console.log("Available seats:", availableSeats);

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