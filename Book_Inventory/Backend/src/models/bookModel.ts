// models/book.ts
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    category: { type: mongoose.Schema.Types.ObjectId,ref:'Category', required: true },
    ISBN: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
