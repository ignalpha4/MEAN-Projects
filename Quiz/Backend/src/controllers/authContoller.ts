import { error } from "console";
import user from "../models/usersModel";
import { ErrorHandling } from "../utils/errorHelper";
import bcrypt from "bcrypt"
import { Response,Request } from "express";
import { generateUserToken } from "../utils/jwt";

const errorObj = new ErrorHandling();

export const signup = async(req:Request,res:Response)=>{

    try {
        const {name,email,password,role,profile} = req.body;

        if(!name || !email || !password || !role){
            throw new Error("Required fields are not provided!")
        }

        const foundUser =  await user.findOne({email});

        if(foundUser){
            throw new Error("Email already exists");
        }

        const newUser =  await user.create(req.body);

        if(!newUser){
            throw new Error("Error creating new user");
        }

        return res.json({status:true,message:"user signup successfully"});

    } catch (error:any) {

        const errormsg = errorObj.getErrorMsg(error) || error.message;
        return res.json({status:false,message:errormsg});
    }

}


export const login=async(req:Request,res:Response)=>{

    try {

        const {email,password}=  req.body;

        const foundUser =  await user.findOne({email});

        if(!foundUser){
            throw new Error("user not found with this email");
        }

        const matchedPass =  await bcrypt.compare(password,foundUser.password);

        if(!matchedPass){
            throw new Error("Incorrect Password");
        }

        const payload = {
            email: foundUser.email,
            id: foundUser._id,
            role: foundUser.role,
          };
      
          const token = await generateUserToken(payload);

        return res.status(200).json({status:true,message:'User logged in successfully',token:token})
        
        
    } catch (error:any) {
        const errormsg = errorObj.getErrorMsg(error) || error.message;
        return res.status(500).json({status:false,message:errormsg});
    }

}

export const getCurrentUser=async(req:any,res:Response)=>{

    try{

        const id = req.user.id;

        if(!id){
            throw new Error("ID Paramater not provided!");
        }

        const foundUser =  await user.findById(id);

        if(!foundUser){
            throw new Error("User not found with this ID");
        }

        return res.status(200).json({status:true,message:"User details found",user:foundUser});
        
    } catch (error:any) {
        const errormsg = errorObj.getErrorMsg(error) || error.message;
        return res.status(500).json({status:false,message:errormsg});
    }

}