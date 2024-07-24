import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  seatNumber: { type: Number, required: true },
  seatId:{type:String,requird:true},
  paymentType: { type: String, required: true },
  totalFare: { type: Number, required: true },
  gender:{type:String}
});

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
