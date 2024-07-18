import express from 'express';
import { getCurrentUser, login, rateBook, signup, updateProfileImage } from '../controllers/userController';
import { authorize, verifyToken } from '../middleware/auth';
import { addBook, listBooks, updateBook, deleteBook, getBookById, getRecommendations } from '../controllers/bookController';

const router = express.Router();

//user login and signup
router.post('/login',login);
router.post('/signup',signup);
router.get('/currentuser',verifyToken,getCurrentUser);

// Update profile image
router.put('/updateProfileImage', verifyToken, updateProfileImage);

//book rating
router.post('/ratebook',verifyToken,rateBook);

//crud books
router.post("/addbook", verifyToken, addBook);
router.get("/listbooks", verifyToken, listBooks);
router.patch("/updatebook/:id", verifyToken, updateBook);
router.delete("/deletebook/:id", verifyToken, deleteBook);

router.get('/getbook/:id',verifyToken,getBookById);
router.get('/recommendations/:id',verifyToken,getRecommendations);

export {router as  allroutes}