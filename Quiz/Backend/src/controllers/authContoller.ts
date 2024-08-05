import user from "../models/usersModel";
import { ErrorHandling } from "../utils/errorHelper";
import bcrypt from "bcrypt";
import { Response, Request } from "express";
import { generateUserToken } from "../utils/jwt";
import upload from "../middlewares/profileUpload";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middlewares/authenticate";

const errorObj = new ErrorHandling();

@controller('/user')
export class userController{

  constructor(){};

  @httpPost('/signup',upload)
  async signup(req: Request, res: Response){
  
      try {
          console.log("inside signup");
          
          const { name, email, password, role } = req.body;

          console.log(req.file);
          
          
          const profileImage = req.file ? `/uploads/${req.file.filename}` : "";
  
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
            profileImage,
          }
      
          const newUser = await user.create(userObj);

          
      
          if (!newUser) {
            throw new Error("Error creating new user");
          }
      
          return res.json({ status: true, message: "user signup successfull" });
  
        } catch (error: any) {
          const errormsg = errorObj.getErrorMsg(error) || error.message;
          console.log(errormsg)
          return res.json({ status: false, message: errormsg });
        }
  };
  
  @httpPost('/login')
  async login(req: Request, res: Response){
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
          user: foundUser,
        });
    } catch (error: any) {

      const errormsg = errorObj.getErrorMsg(error) || error.error;
      console.log(errormsg);
      
      return res.json({ status: false, message: errormsg });
    }
  };
  
  @httpGet('/getCurrentUser',verifyToken)
  async getCurrentUser(req: any, res: Response){
    try {
      const id = req.user.id;
  
      if (!id) {
        throw new Error("ID Paramater not provided!");
      }
  
      const foundUser = await user.findById(id);
  
      if (!foundUser) {
        throw new Error("User not found with this ID");
      }
  
      return res.status(200).json({ status: true, message: "User details found", user: foundUser });

    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.error;
      return res.json({ status: false, message: errormsg });
    }
  };
  
  @httpGet('/getAllUsers',verifyToken)
  async getAllUsers(req:Request,res:Response){
    try {
      const users =  await user.find();

      if(!users){
        throw new Error("No users found");
      }

      console.log("thsese are all users",users);
      
      return res.status(200).json({status:true,message:"Users List",users});
  
    } catch (error:any) {  
      const errormsg =  errorObj.getErrorMsg(error) || error.message;
      return res.status(500).json({status:false,message:errormsg});
    }
  }
}



