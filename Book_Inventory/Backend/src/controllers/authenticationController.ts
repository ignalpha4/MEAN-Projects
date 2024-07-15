
import {Response} from "express"
import userModel from "../models/userModel"
import bcrypt from "bcrypt"
import { generateUserToken } from "../utils/userToken";
import authorModel from "../models/authorModel";

//user signup
export const signup =async(req:any,res:Response)=>{
    try {

        const {email,password,role,profileImage} = req.body;

        const hashedPassword  = await bcrypt.hash(password,10);
    
        const createdUser = await userModel.create({email,password:hashedPassword,role,profileImage});
    
        if(!createdUser){

            console.log("error creating the user");
            req.json({success:false,message:"User creation Error"});
        }
    
        console.log("User SignUp successfull !");

        res.status(200).json({success:true,message:"User SignUp successfull !"});

    } catch (error) {
        console.log(error);
    }
}

//user login
export const login = async (req: any, res: Response) => {

    try {

        const email = req.body.email;
        const password = req.body.password;
        
        const foundUser = await userModel.findOne({ email });

        if (!foundUser) {
            console.log("No user found with this email");
            return res.json({ message: "User not found with this email!",success:false });
        }

        const matchedPassword = await bcrypt.compare(password, foundUser.password);

        if (!matchedPassword) {
            console.log("Incorrect Password");
            return res.json({success:false,message: "Incorrect Password" });
        }

        const payload = {
            email: foundUser.email,
            id: foundUser._id,
            role: foundUser.role
        };

        const token = await generateUserToken(payload);

        return res.json({ success:true,message: "User logged In successfully", token: token});

    } catch (error) {
        return res.json({success:false, message: "Internal Server Error" });
    }
};


//signup author
export const authorSignup = async(req:any,res:Response)=>{

    try {

        
        let role="author";

        const {email,password,name,biography,nationality,profileImage} = req.body;


        const hashedPassword  = await bcrypt.hash(password,10);
    
        const createdUser = await userModel.create({email,password:hashedPassword,role,profileImage});

        const createdAuthor = await authorModel.create({nationality,biography,name,userId:createdUser._id});


        if(!createdUser){
            console.log("error creating the user");
            req.json({success:false,message:"User creation Error"});
            throw new Error;
        }

        if(!createdAuthor){
            console.log("unable to create author");

            if(createdUser){
                await userModel.findByIdAndDelete(createdUser._id);
            }

            req.json({success:false,message:"author creation error"});
        }

        console.log("Author SignUp successfull !");
        res.json({success:true,message:"Author SignUp successfull !"});

    } catch (error) {
        console.log(error);
        
    }
}


// List authors
export const listUsers = async (req: any, res: any) => {
    try {
        const foundUsers = await userModel.find();

        if (!foundUsers) {
            console.log("No users found");
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({ message: "List of users", users: foundUsers });
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

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

//updateProfile Image

export const updateProfileImage = async(req:any,res:any)=>{

        const { profileImage } = req.body;
        const userId = req.user.id; 
        try {
          await userModel.findByIdAndUpdate(userId, { profileImage });
          res.status(200).json({ success: true, message: 'Profile image updated successfully' });
        } catch (error) {
          res.status(500).json({ success: false, message: 'Failed to update profile image' });
        }
}