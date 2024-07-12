
import {Response} from "express"
import userModel from "../models/userModel"
import bcrypt from "bcrypt"
import { generateUserToken } from "../utils/userToken";
import authorModel from "../models/authorModel";

//user signup
export const signup =async(req:any,res:Response)=>{
    try {

        const {email,password,role} = req.body;

        const hashedPassword  = await bcrypt.hash(password,10);
    
        const createdUser = await userModel.create({email,password:hashedPassword,role});
    
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

        console.log("User logged In");
        return res.json({ success:true,message: "User logged In successfully", token: token});

    } catch (error) {
        console.log(error);
        return res.json({success:false, message: "Internal Server Error" });
    }
};



export const authorSignup = async(req:any,res:Response)=>{

    try {

        console.log("hit author signup");
        
        let role="author";

        const {email,password,name,biography,nationality} = req.body;


        const hashedPassword  = await bcrypt.hash(password,10);
    
        const createdUser = await userModel.create({email,password:hashedPassword,role});

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

