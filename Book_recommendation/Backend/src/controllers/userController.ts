import bcrypt from 'bcrypt';
import userModel from '../models/user.model';
import upload from '../middleware/fileUpload';
import { Request, Response } from 'express';
import { generateUserToken } from '../utils/jwtToken';

// User signup
export const signup = (req: Request, res: Response) => {
  upload(req, res, async (err:any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    try {
      const { name, email, password, role } = req.body;
      const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await userModel.create({ name, email, password: hashedPassword, role, profileImage });

      if (!createdUser) {
        console.log('Error creating the user');
        return res.json({ success: false, message: 'User creation error' });
      }

      console.log('User Signup successful!');
      res.json({ success: true, message: 'User Signup successful!' });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await userModel.findOne({ email });

    if (!foundUser) {
      console.log('No user found with this email');
      return res.json({ message: 'User not found with this email!', success: false });
    }

    const matchedPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchedPassword) {
      console.log('Incorrect Password');
      return res.json({ success: false, message: 'Incorrect Password' });
    }

    const payload = {
      email: foundUser.email,
      id: foundUser._id,
      role: foundUser.role,
    };

    const token = await generateUserToken(payload);

    return res.json({ success: true, message: 'User logged in successfully', token, role: foundUser.role });

  } catch (error) {
    return res.json({ success: false, message: 'Internal Server Error' });
  }
};


//getcurrent user
export const getCurrentUser = async(req:any,res:any)=>{
  try {
      let id = req.user.id;

      let user = await userModel.findById(id);
  
      if(!user){
          return res.json({success:false,message:"No current user found"});
      }   
      return res.json({success:true,message:"current user found",user:{email:user.email,role:user.role,profileImage:user.profileImage}});  
  } catch (error) {
      console.log(error);
  }
}


export const updateProfileImage = (req: any, res: Response) => {
  upload(req, res, async (err:any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    try {
      const userId = req.user.id; // Assuming user ID is available in req.user
      const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

      const updatedUser = await userModel.findByIdAndUpdate(userId, { profileImage }, { new: true });

      if (!updatedUser) {
        console.log('Error updating the user');
        return res.status(500).json({ success: false, message: 'User update error' });
      }

      console.log('Profile image updated successfully!');
      res.json({ success: true, message: 'Profile image updated successfully!', profileImage: updatedUser.profileImage });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
};