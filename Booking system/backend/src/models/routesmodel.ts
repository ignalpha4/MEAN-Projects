import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  distance: { type: Number, required: true },
});

const routeSchema = new mongoose.Schema({
  uniqueIdentifier: { type: String, required: true, unique: true },
  stations: [stationSchema],
});

const routeModel = mongoose.model("Route", routeSchema);
export default routeModel;
