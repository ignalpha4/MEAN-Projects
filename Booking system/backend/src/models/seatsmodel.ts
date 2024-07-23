import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  date: { type: Date, required: true },
  seatNumber: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  isFemale:{type:Boolean,default:false}
});

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;