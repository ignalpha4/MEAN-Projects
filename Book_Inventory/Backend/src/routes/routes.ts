import express from "express";
import { addBook, deleteBook, listBooks, updateBook } from "../controllers/booksController";
import { addAuthor, deleteAuthor, listAuthors, updateAuthor } from "../controllers/authorController";
import { addCategory, deleteCategory, listCategory, updateCategory } from "../controllers/categoryController";
import { authorSignup, getCurrentUser, listUsers, login, signup, updateProfileImage } from "../controllers/authenticationController";
import { verifyToken, authorize } from "../middleware/auth";

const router = express.Router();

// Login and signup
router.post("/signup", signup);
router.post("/authorSignup",authorSignup);
router.post("/login", login);
router.get("/listusers",verifyToken,authorize(['admin',"author"]), listUsers);
router.get('/currentuser',verifyToken,getCurrentUser);
router.put('/updateProfileImage',verifyToken,updateProfileImage);

// CRUD Books
router.post("/addbook", verifyToken, authorize(['admin', 'author']), addBook);
router.get("/listbooks", verifyToken, authorize(['admin', 'author', 'user']), listBooks);
router.patch("/updatebook/:id", verifyToken, authorize(['admin', 'author']), updateBook);
router.delete("/deletebook/:id", verifyToken, authorize(['admin','author']), deleteBook);

// CRUD Authors
router.post("/addauthor", verifyToken, authorize(['admin']), addAuthor);
router.get("/listauthors", verifyToken, authorize(['admin','author']), listAuthors);
router.patch("/updateauthor/:id", verifyToken, authorize(['admin', 'author']), updateAuthor);
router.delete("/deleteauthor/:id", verifyToken, authorize(['admin','author']), deleteAuthor);

// CRUD Categories
router.post("/addcategory",verifyToken,authorize(['admin']),addCategory);
router.get("/listcategory",verifyToken,authorize(['admin','author']), listCategory);
router.patch("/updatecategory/:id",verifyToken,authorize(['admin']), updateCategory);
router.delete("/deletecategory/:id",verifyToken,authorize(['admin']), deleteCategory);

export { router as allRoutes };
