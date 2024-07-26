import { error } from "console";
import user from "../models/usersModel";
import { ErrorHandling } from "../utils/errorHelper";
import bcrypt from "bcrypt";
import { Response, Request } from "express";
import { generateUserToken } from "../utils/jwt";
import upload from "../middlewares/profileUpload";

const errorObj = new ErrorHandling();

export const signup = async (req: any, res: Response) => {
  upload(req, res, async (error: any) => {
    if (error) {
      return res.status(400).json({ status: false, message: error });
    }

    try {
        const { name, email, password, role } = req.body;

        const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

        if (!name || !email || !password || !role) {
          throw new Error("Required fields are not provided!");
        }
    
        const foundUser = await user.findOne({ email });
    
        if (foundUser) {
          throw new Error("Email already exists");
        }

        let userObj = {
          name,
          email,
          password,
          role,
          profile:profileImage
        }
    
        const newUser = await user.create(userObj);
    
        if (!newUser) {
          throw new Error("Error creating new user");
        }
    
        return res.json({ status: true, message: "user signup successfully" });
      } catch (error: any) {
        const errormsg = errorObj.getErrorMsg(error) || error.message;
        return res.json({ status: false, message: errormsg });
      }


  });


};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      throw new Error("user not found with this email");
    }

    const matchedPass = await bcrypt.compare(password, foundUser.password);

    if (!matchedPass) {
      throw new Error("Incorrect Password");
    }

    const payload = {
      email: foundUser.email,
      id: foundUser._id,
      role: foundUser.role,
    };

    const token = generateUserToken(payload);

    return res
      .status(200)
      .json({
        status: true,
        message: "User logged in successfully",
        token: token,
      });
  } catch (error: any) {
    const errormsg = errorObj.getErrorMsg(error) || error.message;
    return res.status(500).json({ status: false, message: errormsg });
  }
};

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const id = req.user.id;

    if (!id) {
      throw new Error("ID Paramater not provided!");
    }

    const foundUser = await user.findById(id);

    if (!foundUser) {
      throw new Error("User not found with this ID");
    }

    return res
      .status(200)
      .json({ status: true, message: "User details found", user: foundUser });
  } catch (error: any) {
    const errormsg = errorObj.getErrorMsg(error) || error.message;
    return res.status(500).json({ status: false, message: errormsg });
  }
};

export const getAllUsers = async(req:Request,res:Response)=>{
  
  try {
    const users =  await user.find();

    if(!users){
      throw new Error("No users found");
    }

    return res.status(200).json({status:true,message:"Users List",users});

  } catch (error:any) {  
    const errormsg =  errorObj.getErrorMsg(error) || error.message;
    return res.status(500).json({status:false,message:errormsg});
  }

}
