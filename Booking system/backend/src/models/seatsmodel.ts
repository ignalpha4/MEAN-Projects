import mongoose from "mongoose";

const seatNumbersSchema = new mongoose.Schema({
  number:{type:Number,require:true},
  isBooked:{type:Boolean,default:false},
  isFemale:{type:Boolean,default:false}
}) 

const seatSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  date: { type: Date, required: true },
  seats: [seatNumbersSchema],
});

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;