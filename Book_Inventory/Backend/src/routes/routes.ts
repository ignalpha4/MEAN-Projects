import express from "express";
import { addBook, deleteBook, listBooks, updateBook } from "../controllers/booksController";
import { addAuthor, deleteAuthor, listAuthors, updateAuthor } from "../controllers/authorController";
import { addCategory, deleteCategory, listCategory, updateCategory } from "../controllers/categoryController";
import { authorSignup, login, signup } from "../controllers/authenticationController";
import { verifyToken, authorize } from "../middleware/auth";

const router = express.Router();

// Login and signup
router.post("/signup", signup);
router.post("/authorSignup",authorSignup);
router.post("/login", login);

// CRUD Books
router.post("/addbook", verifyToken, authorize(['admin', 'author']), addBook);
router.get("/listbooks", verifyToken, authorize(['admin', 'author', 'user']), listBooks);
router.patch("/updatebook", verifyToken, authorize(['admin', 'author']), updateBook);
router.delete("/deletebook", verifyToken, authorize(['admin','author']), deleteBook);

// CRUD Authors
router.post("/addauthor", verifyToken, authorize(['admin']), addAuthor);
router.get("/listauthors", verifyToken, authorize(['admin']), listAuthors);
router.patch("/updateauthor", verifyToken, authorize(['admin', 'author']), updateAuthor);
router.delete("/deleteauthor", verifyToken, authorize(['admin']), deleteAuthor);

// CRUD Categories
router.post("/addcategory", verifyToken, authorize(['admin']), addCategory);
router.get("/listcategory", verifyToken, authorize(['admin', 'user']), listCategory);
router.patch("/updatecategory", verifyToken, authorize(['admin']), updateCategory);
router.delete("/deletecategory", verifyToken, authorize(['admin']), deleteCategory);

export { router as allRoutes };
