import bookingModel from "../models/bookingmodel";
import busModel from "../models/busesmodel";


export const bookSeat = async (req:any, res:any) => {

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

    
    const requiredFields = [ "userId",
      "busId",
      "from",
      "to",
      "date",
      "seatNumber",
      "paymentType",
      "totalFare",
       "seatId" ]
      const missingFields=  requiredFields.filter((fields) =>{
        !req.body
      })

      if(missingFields.length > 0){
        console.log("missing fields");
        return res.json({success:false, message: `Missing required fields ${missingFields}` });
        
      }


    const bus = await busModel.findById(busId).populate("route");

    if (!bus) {
      return res.status(404).json({success:false, message: "Bus not found" });
    }

    const existingBooking = await bookingModel.findOne({
      bus: busId,
      seatNumber,
      date,
    });

    if (existingBooking) {
      return res.json({succcess:false, message: "Seat is already booked" });
    }

    const newBooking = new bookingModel({
      userId: userId,
      bus: busId,
      from,
      to,
      date,
      seatNumber,
      paymentType,
      totalFare,
      seatId
    });
    await newBooking.save();



    res.json({success:true});
  }
  catch (error) {
    console.log(error)
    res.json({ message: error});
  }
};
