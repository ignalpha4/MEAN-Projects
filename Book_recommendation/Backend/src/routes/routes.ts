import express from 'express';
import { getCurrentUser, login, signup, updateProfileImage } from '../controllers/userController';
import { authorize, verifyToken } from '../middleware/auth';

const router = express.Router();

//user login and signup
router.post('/login',login);
router.post('/signup',signup);
router.get('/currentuser',verifyToken,getCurrentUser);

// Update profile image
router.put('/updateProfileImage', verifyToken, updateProfileImage);


export {router as  allroutes}