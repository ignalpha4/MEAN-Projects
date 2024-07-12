// models/author.ts
import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  biography: { type: String },
  nationality: { type: String },
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
