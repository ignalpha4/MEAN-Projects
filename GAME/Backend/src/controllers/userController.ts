import bcrypt from 'bcrypt';
import userModel from '../models/user.model';
import { Request, Response } from 'express';
import { generateUserToken } from '../utils/jwtToken';
import uploadProfile from '../middleware/profileUpload';
import player from '../models/game.model';


export const signup = (req: Request, res: Response) => {

  uploadProfile (req, res, async (err:any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    try {
      const { name, email, password, role } = req.body;
      const profileImage = req.file ? `/uploads/profileImg/${req.file.filename}` : '';

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

// login
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



export const getCurrentUser = async(req:any,res:any)=>{
  try {
    
      let id = req.user.id;

      let user = await userModel.findById(id);
  
      if(!user){
          return res.json({success:false,message:"No current user found"});
      }   
      return res.json({success:true,message:"current user found",user});  
  } catch (error) {
      console.log(error);
  }
}

export const updateProfileImage = (req: any, res: Response) => {

  uploadProfile(req, res, async (err:any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    try {
      const userId = req.user.id; 
      const profileImage = req.file ? `/uploads/profileImg/${req.file.filename}` : '';

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


export const listUsers = async(req:any,res:Response)=>{
  try {
    
    let users = await userModel.find({role:'user'});

    if(!users){
        return res.json({success:false,message:"No  users found"});
    }   
    return res.json({success:true,message:"current user found",users});  
} catch (error) {
    console.log(error);
}
}

export const deleteUser = async(req:any,res:Response)=>{

  try {
    
    const id = req.params.id;
  
    const deletedUser = await userModel.findByIdAndDelete(id);
  
    if(!deleteUser){
      return res.json({success:false,message:"No user found to delete"});
    }
    
    return res.json({success:true,message:'user deleted successfully'})

  } catch (error) {
    console.log(error);
    return res.json({message:'Error while deleting',error});
  }

}


export const updateUser = async(req:any,res:Response)=>{
  
  uploadProfile(req,res,async(err:any)=>{
    if(err){
      console.log('Error uploading image',err);
    }

    try {
      
      const id = req.params.id;

      const exisitingUser= await userModel.findById(id);

      if(!exisitingUser){
        console.log("No book found to update");
        return res.json({success:false,message:'No user found to update'});
      }

      const { name, email, password, role } = req.body;
      const profileImage = req.file ? `/uploads/profileImg/${req.file.filename}` : '';

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUserDetails = await userModel.findByIdAndUpdate(id,{ name, email, password: hashedPassword, role, profileImage });

      return res.json({success:true,message:'user updated',user:updatedUserDetails});
    } catch (error) {
      console.log('Error updating the user');
      return res.json({success:false,message:'Error updating user',error});
    }
  })
}

