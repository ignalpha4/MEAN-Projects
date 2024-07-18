import express from 'express';
import { deleteUser, getCurrentUser, listUsers, login, signup, updateProfileImage, updateUser } from '../controllers/userController';
import {authorize} from '../middleware/authorization'
import { verifyToken } from '../middleware/authentication';

const router = express.Router();

//user login and signup
router.post('/login',login);
router.post('/signup',signup);

//current user details
router.get('/currentuser',verifyToken,getCurrentUser);
// Update profile image
router.put('/updateProfileImage',verifyToken, updateProfileImage);

router.get('/listusers',verifyToken,listUsers);

router.delete('/deleteUser/:id',verifyToken,deleteUser);
router.patch('/updateUser/:id',verifyToken,updateUser);

export {router as  allroutes}