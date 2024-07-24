import bookingModel from "../models/bookingmodel";
import busModel from "../models/busesmodel";


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
      seatId,
      gender
    } = req.body;

    // Check for missing fields
    const requiredFields = ["userId", "busId", "from", "to", "date", "seatNumber", "paymentType", "totalFare", "seatId"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      console.log("missing fields");
      return res.json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Find the bus
    const bus = await busModel.findById(busId).populate("route");
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // Check if the seat is already booked
    const existingBooking = await bookingModel.findOne({ bus: busId, seatNumber, date });
    if (existingBooking) {
      return res.json({ success: false, message: "Seat is already booked" });
    }

    // Create a new booking
    const newBooking = new bookingModel({
      userId,
      bus: busId,
      from,
      to,
      date,
      seatNumber,
      paymentType,
      totalFare,
      seatId,
      gender
    });

    await newBooking.save();
    res.json({ success: true, message: 'Seat booked successfully' });
  } catch (error) {
    console.log("Error booking seat:", error);
    res.json({ success: false, message: "Failed to book seat", error });
  }
};
