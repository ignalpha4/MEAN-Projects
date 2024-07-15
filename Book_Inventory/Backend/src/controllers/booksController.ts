import { Request, Response } from 'express';
import bookModel from '../models/bookModel';
import mongoose from 'mongoose';
import authorModel from '../models/authorModel';

// Add a book
export const addBook = async (req: any, res: Response) => {
    try {
        const book = req.body;

        if (req.user.role === 'author') {
            let authorfound= await authorModel.findOne({userId:req.user.id});

            if(!authorfound){
                console.log("No author found for associated with this user");
                return res.json({success:false, message: "No author found for associated with this user" });
            }
            book.author = authorfound._id;
        }

        const addedBook = await bookModel.create(book);

        if (!addedBook) {
            console.log("Provide the necessary details to add a book");
            return res.json({success:false, message: "Provide the necessary details to add a book" });
        }

        console.log("Added Book", addedBook);
        return res.json({success:true, message: "Book added", book: addedBook });

    } catch (error) {
        console.error('Error adding book:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// books list
export const listBooks = async (req: any, res: Response) => {

    try {
        let matchCondition: any = {};

        if (req.user.role === 'author') {
            //finding the author details using the userid 
            const authorFound = await authorModel.findOne({ userId: req.user.id });
            
            if (!authorFound) {
                console.log("No author found for this user");
                return res.json({success:false, message: "No author found for this user" });
            }

            console.log("This is the author:", authorFound);

            //for pipeline
            matchCondition = { author: authorFound._id };
        }


        const foundBooks = await bookModel.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: '$authorDetails'
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $project: {
                    title: 1,
                    author:1,
                    category:1,
                    'authorDetails.name': 1,
                    'categoryDetails.name': 1,
                    ISBN: 1,
                    description: 1,
                    price: 1
                }
            }
        ]);

        console.log("Books found with match condition:", foundBooks);

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

        let deletedBook;

        const foundBook = await bookModel.findById(id);

        
        if(req.user.role === 'author') {
            const authorFound = await authorModel.findOne({ userId: req.user.id });
            
            if (!authorFound) {
                console.log("No author found for this user");
                return res.json({success:false, message: "No author found for this user" });
            }
            
            if (foundBook?.author.toString() === authorFound._id.toString()) {
                deletedBook = await bookModel.findByIdAndDelete(id);
            }else {
                console.log("Author not authorized to delete the book");
                return res.json({ success:false,message: "Author not authorized to delete the book" });
            }

        }else{
            deletedBook = await bookModel.findByIdAndDelete(id);
        }

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
export const updateBook = async (req: any, res: Response) => {
    try {
        const id = req.params.id;

        let updatedBook;

        const foundBook = await bookModel.findById(id);

        if (req.user.role === 'author') {

            const authorFound = await authorModel.findOne({ userId: req.user.id });
            
            if (!authorFound) {
                console.log("No author found for this user");
                return res.json({success:false, message: "No author found for this user" });
            }
            

            if (foundBook?.author.toString() === authorFound._id.toString()) {
                req.body.author = authorFound._id;
                updatedBook = await bookModel.findByIdAndUpdate(id, req.body);
                return res.json({success:true, message: "Book updated", book: updatedBook });
            } else {
                console.log("Author not authorized to update the book");
                return res.status(403).json({ message: "Author not authorized to update the book" });
            }
        }


        updatedBook = await bookModel.findByIdAndUpdate(id, req.body);

        if (!updatedBook) {
            console.log("No book found to update");
            return res.json({success:false, message: "No book found to update" });
        }

        console.log("Book updated:\n", updatedBook);
        return res.json({success:true, message: "Book updated", book: updatedBook });

    } catch (error) {
        console.error('Error updating book:', error);
        return res.json({success:false, message: 'Internal server error' });
    }
};
