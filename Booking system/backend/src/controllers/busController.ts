import busModel from "../models/busesmodel";
import routeModel from "../models/routesmodel";
import Seat from "../models/seatsmodel";

export const addBus = async (req:any, res:any) => {

  try {


    const { busNumber, seatingCapacity, amenities, routeId, stops,date,fare,tax } = req.body;

    if (!busNumber || !seatingCapacity || !routeId || !stops || !date || !fare || !tax) {
      return res.json({ message: "All fields are required." });
    }

    const newBus = await busModel.create({
      busNumber,
      seatingCapacity,
      amenities: amenities.split(",").map((item:any) => item.trim()), 
      route:routeId,
      date,
      fare,
      tax,
      stops
    });

    return res.json({success:true,bus:newBus});

  } catch (error) {
    console.log(error);
  }
};

export const getBuses = async (req: any, res: any) => {

  try {
    
    const buses = await busModel.find();

    if (!buses) {
      return res.json({ success: false, message: "User not found" });
    }
     return res.json({ success: true, buses: buses });

  } catch (error) {
    console.log(error);
    return res.json({success:false,message:error});
  }

};

export const getBusById = async (req:any,res:any)=>{
  try {
      const id =req.params.id;

      const foundBus =  await busModel.findById(id);

      if(!foundBus){
        return res.json({success:false,message:'No user found with this is'});
      }

      return res.json({success:true,bus:foundBus});

  } catch (error) {
      res.json({success:false,message:"error in getting the bus by id"})
  }
}

export const addSeats = async (req: any, res: any) => {
  try {
    const { busId, totalSeats, date } = req.body;

    const seats :any= [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push({ busId, seatNumber: i, isBooked: false, date,isFemale:false });
    }

    await Seat.insertMany(seats);



    res.json({ success: true, message: 'Seats added successfully' });

  } catch (error) {
    console.error('Error adding seats:', error);
    res.status(500).json({ success: false, message: 'Failed to add seats', error });
  }
};


export const filteredBuses =async(req:any,res:any)=>{

  try {

    const  { from ,to ,date} = req.query;

    const foundBuses = await busModel.aggregate([
      {
        $match: {
          "stops.station": { $all: [from, to] },
          date: new Date(date)
        }
      },
      {
        $addFields: {
          fromIndex: { $indexOfArray: ["$stops.station", from] },
          toIndex: { $indexOfArray: ["$stops.station", to] }
        }
      },
      {
        $match: {
          $expr: { $lt: ["$fromIndex", "$toIndex"] }
        }
      }
    ]);


    if(!foundBuses){
      return res.json({success:false,message:"No buses found"});
    }

    return res.json({success:false,message:"Found buses",buses:foundBuses});
 
  } catch (error) {
    console.log("Error getting filtered buses");
    return res.json({success:false,message:`Error getting filtered buses ${error}`});
  }

}