import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  seatingCapacity: { type: Number, required: true },
  amenities: [{ type: String }],
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  date:{type: Date, required: true },
  fare:{type:Number,required:true},
  tax:{type:Number,required:true},
  stops: [
    {
      station: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
});

const busModel = mongoose.model("Bus", busSchema);
export default busModel;
