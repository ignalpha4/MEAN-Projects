// models/book.ts
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    ISBN: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    bookImage:{
        type:String
    }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;