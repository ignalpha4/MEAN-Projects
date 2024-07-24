import busModel from "../models/busesmodel";

export const addBus = async (req:any, res:any) => {

  try {

    const { busNumber, seatingCapacity, amenities, routeId, stops,fare,tax } = req.body;

    if (!busNumber || !seatingCapacity || !routeId || !stops  || !fare || !tax) {
      return res.json({ message: "All fields are required." });
    }

    const newBus = await busModel.create({
      busNumber,
      seatingCapacity,
      amenities: amenities.split(",").map((item:any) => item.trim()), 
      route:routeId,
      fare,
      tax,
      stops
    });

    return res.json({success:true,bus:newBus});

  } catch (error) {
    console.log(error);
    return res.json("Error adding the bus",error)
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


export const filteredBuses =async(req:any,res:any)=>{

  try {

    const  { from ,to ,date} = req.query;

    const foundBuses = await busModel.aggregate([
      {
        $match: {
          "stops.station": { $all: [from, to] },
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