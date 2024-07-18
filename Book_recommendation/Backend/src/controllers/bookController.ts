import { Request, Response } from 'express';
import bookModel from '../models/book.model';
import mongoose from 'mongoose';
import userModel from '../models/user.model';
import upload from '../middleware/bookUpload';

const ObjectId = mongoose.Types.ObjectId;
// Add a book

export const addBook = async (req: Request, res: Response) => {
    upload(req, res, async (err:any) => {
        if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ message: 'Error uploading image' });
        }

        try {
            const { title, author, category, ISBN, description, price } = req.body;
            const bookImage = req.file ? `/uploads/books/${req.file.filename}` : '';

            const newBook = new bookModel({
                title,
                author,
                category,
                ISBN,
                description,
                price,
                bookImage 
            });

            const addedBook = await newBook.save();

            return res.json({ success: true, message: 'Book added', book: addedBook });

        } catch (error) {
            console.error('Error adding book:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};


// books list
export const listBooks = async (req: any, res: Response) => {
    try {
        const foundBooks = await bookModel.find();

        if (!foundBooks || foundBooks.length === 0) {
            console.log("No books found");
            return res.json({ success:false,message: "No books found" });
        }
        res.json({ success:true,message: "Available Books", books: foundBooks });
    } catch (error) {
        console.error('Error listing books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteBook = async (req: any, res: Response) => {
    try {
        const id = req.params.id;

        let deletedBook = await bookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            console.log("No book found to delete");
            return res.json({success:false, message: "No book found to delete" });
        }else{
            return res.json({success:true, message: "Book deleted", book: deletedBook });
        }

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({success:false, message: 'Internal server error' });
    }
};

// Update a book
export const updateBook = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ message: 'Error uploading image' });
        }

        try {
            const id = req.params.id;

            // Find the existing book
            const existingBook = await bookModel.findById(id);
            if (!existingBook) {
                console.log("No book found to update");
                return res.status(404).json({ success: false, message: "No book found to update" });
            }

            // Update book details
            const { title, author, category, ISBN, description, price } = req.body;
            const bookImage = req.file ? `/uploads/books/${req.file.filename}` : existingBook.bookImage;

            // Ensure to handle empty fields by checking the body parameters
            const updatedBookData = {
                title: title || existingBook.title,
                author: author || existingBook.author,
                category: category || existingBook.category,
                ISBN: ISBN || existingBook.ISBN,
                description: description || existingBook.description,
                price: price || existingBook.price,
                bookImage: bookImage
            };

            const updatedBook = await bookModel.findByIdAndUpdate(id, updatedBookData, { new: true });

            return res.json({ success: true, message: "Book updated", book: updatedBook });

        } catch (error) {
            console.error('Error updating book:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
};

export const getBookById= async(req:any,res:Response)=>{

    try {
        const id = req.params.id;
        const foundBook = await bookModel.findById(id);

        if (!foundBook) {
            console.log("No book found with this Id");
            return res.json({ success:false,message: "Book not found" });
        }

        res.json({ success:true,message: "Found Book", book: foundBook });


    } catch (error) {
        console.log("Error getting the book",error);
        return res.json({success:false,message:'internal server error'});
    }

}


export const getRecommendations = async (req: any, res: any) => {
  try {
    const userId = req.params.id;

    // to get higly rated book sof user
    const userAggregation = await userModel.aggregate([
      { $match: { _id:new ObjectId(userId) } },
      { $unwind: '$ratings' },
      {
        $match: {
          'ratings.rating': { $gte: 4 }
        }
      },
      {
        $lookup: {
          from: 'books', 
          localField: 'ratings.bookId',
          foreignField: '_id',
          as: 'ratedBooks'
        }
      },
      { $unwind: '$ratedBooks' },
      {
        $group: {
          _id: null,
          highlyRatedBooks: { $addToSet: '$ratedBooks' }
        }
      }
    ]);

    if (!userAggregation || userAggregation.length === 0 || !userAggregation[0].highlyRatedBooks) {
      return res.json({ success: false, message: 'No highly rated books found for recommendations' });
    }

    const { highlyRatedBooks } = userAggregation[0];

    const categories = [...new Set(highlyRatedBooks.map((book: any) => book.category))];
    const authors = [...new Set(highlyRatedBooks.map((book: any) => book.author))];

    //to get recommended books
    const recommendedBooks = await bookModel.aggregate([
      {
        $match: {
          $or: [
            { category: { $in: categories } },
            { author: { $in: authors } }
          ],
          _id: { $nin: highlyRatedBooks.map((book: any) => book._id) } 
        }
      }
    ]);

    return res.json({ success: true, message: 'Recommended books', books: recommendedBooks });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};