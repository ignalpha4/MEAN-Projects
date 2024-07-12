import { Request, Response } from 'express';
import bookModel from '../models/bookModel';

// Add a book
export const addBook = async (req: any, res: Response) => {
    try {
        const book = req.body;

       
        if (req.user.role === 'author') {
            book.author = req.user._id;
        }

        const addedBook = await bookModel.create(book);

        if (!addedBook) {
            console.log("Provide the necessary details to add a book");
            return res.status(400).json({ message: "Provide the necessary details to add a book" });
        }

        console.log("Added Book", addedBook);
        res.status(200).json({ message: "Book added", book: addedBook });

    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// books list
export const listBooks = async (req: any, res: Response) => {
    try {
        let foundBooks;


        if (req.user.role === 'author') {
            const authorId = req.user._id;
            foundBooks = await bookModel.find({ author: authorId });
        } else {
            foundBooks = await bookModel.find();
        }

        if (!foundBooks || foundBooks.length === 0) {
            console.log("No books found");
            return res.status(404).json({ message: "No books found" });
        }

        console.log("Available Books:\n", foundBooks);
        res.status(200).json({ message: "Available Books", books: foundBooks });

    } catch (error) {
        console.error('Error listing books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteBook = async (req: any, res: Response) => {
    try {
        const { id } = req.body;

        let deletedBook;

        const foundBook = await bookModel.findById(id);

        
        if (req.user.role === 'author') {
            if (req.user._id === foundBook?.author.toString()) {
                deletedBook = await bookModel.findByIdAndDelete(id);
                console.log("Book deleted", deletedBook);
                return res.status(200).json({ message: "Book deleted", book: deletedBook });
            } else {
                console.log("Author not authorized to delete the book");
                return res.status(403).json({ message: "Author not authorized to delete the book" });
            }
        }

     
        deletedBook = await bookModel.findByIdAndDelete(id);

        if (!deletedBook) {
            console.log("No book found to delete");
            return res.status(404).json({ message: "No book found to delete" });
        }

        console.log("Book Deleted:\n", deletedBook);
        res.status(200).json({ message: "Book deleted", book: deletedBook });

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a book
export const updateBook = async (req: any, res: Response) => {
    try {
        const { id } = req.body;

        let updatedBook;

        const foundBook = await bookModel.findById(id);

        if (req.user.role === 'author') {
            if (req.user._id === foundBook?.author.toString()) {
                req.body.author = req.user._id;
                updatedBook = await bookModel.findByIdAndUpdate(id, req.body, { new: true });
                console.log("Book updated", updatedBook);
                return res.status(200).json({ message: "Book updated", book: updatedBook });
            } else {
                console.log("Author not authorized to update the book");
                return res.status(403).json({ message: "Author not authorized to update the book" });
            }
        }


        updatedBook = await bookModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBook) {
            console.log("No book found to update");
            return res.status(404).json({ message: "No book found to update" });
        }

        console.log("Book updated:\n", updatedBook);
        res.status(200).json({ message: "Book updated", book: updatedBook });

    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
