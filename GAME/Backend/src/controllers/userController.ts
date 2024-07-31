import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import { Request, Response } from "express";
import { generateUserToken } from "../utils/jwtToken";
import uploadProfile from "../middleware/profileUpload";
import { controller, httpDelete, httpGet, httpPatch, httpPost, httpPut } from "inversify-express-utils";
import { moduleType } from "../utils/module.type";
import { verifyToken } from "../middleware/authentication";
import upload from "../middleware/profileUpload";


@controller('/user')
export class userController {

  constructor(){};

  //signup
  @httpPost('/signup',upload)
  async signup(req: Request, res: Response){
      try {
        const { name, email, password, role } = req.body;
        const profileImage = req.file
          ? `/uploads/profileImg/${req.file.filename}`
          : "";

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await userModel.create({
          name,
          email,
          password: hashedPassword,
          role,
          profileImage,
        });

        if (!createdUser) {
          console.log("Error creating the user");
          throw new Error('User Creation Error')
        }

        console.log("User Signup successful!");
        return res.json({ success: true, message: "User Signup successful!" });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    };
  

  @httpPost('/login')
  async login(req: Request, res: Response){
    try {
      const email = req.body.email;
      const password = req.body.password;

      const foundUser = await userModel.findOne({ email });

      if (!foundUser) {
        console.log("No user found with this email");
        return res.json({
          message: "User not found with this email!",
          success: false,
        });
      }

      const matchedPassword = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!matchedPassword) {
        console.log("Incorrect Password");
        return res.json({ success: false, message: "Incorrect Password" });
      }

      const payload = {
        email: foundUser.email,
        id: foundUser._id,
        role: foundUser.role,
      };

      const token = generateUserToken(payload);

      return res.json({
        success: true,
        message: "User logged in successfully",
        token,
        role: foundUser.role,
      });
    } catch (error) {
      return res.json({ success: false, message: "Internal Server Error" });
    }
  };

  //getcurrent user info
  @httpGet('/currentuser',verifyToken)
  async getCurrentUser(req: any, res: Response){
    try {
      let id = req.user.id;

      let user = await userModel.findById(id);

      if (!user) {
        return res.json({ success: false, message: "No current user found" });
      }
      return res.json({ success: true, message: "current user found", user });
    } catch (error) {
      console.log(error);
    }
  };

  //update Profile Image
  @httpPut('/updateProfileImage',verifyToken,upload)
  async updateProfileImage(req: any, res: any) {
      try {
        const userId = req.user.id;
        const profileImage = req.file
          ? `/uploads/profileImg/${req.file.filename}`
          : "";

        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { profileImage },
          { new: true }
        );

        if (!updatedUser) {
          console.log("Error updating the user");
          throw new Error('User update error');
        }

        console.log("Profile image updated successfully!");
        res.json({success: true,message: "Profile image updated successfully!"});
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }

  //get all users
  @httpGet('/listusers',verifyToken)
  async listUsers(req: any, res: Response){
    try {
      let users = await userModel.find({ role: "user" });

      if (!users) {
        return res.json({ success: false, message: "No  users found" });
      }this.signup
      return res.json({ success: true, message: "current user found", users });
    } catch (error) {
      console.log(error);
    }
  };

  //update users
  @httpPatch('/updateUser/:id',upload)
  async updateUser(req: any, res: any) {
      try {
        const id = req.params.id;

        const exisitingUser = await userModel.findById(id);

        if (!exisitingUser) {
          console.log("No user found to update");
          throw new Error('No user found to update');
        } 

        const { name, email, password, role } = req.body;
        const profileImage = req.file
          ? `/uploads/profileImg/${req.file.filename}`
          : "";

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUserDetails = await userModel.findByIdAndUpdate(id, {
          name,
          email,
          password: hashedPassword,
          role,
          profileImage,
        });

         res.json({
          success: true,
          message: "user updated",
          user: updatedUserDetails,
        });
      } catch (error) {
        console.log("Error updating the user");
         res.json({
          success: false,
          message: "Error updating user",
          error,
        });
      }
    }
 

  @httpDelete('/deleteUser/:id',verifyToken)
  async deleteUser(req: any, res: Response){
    try {
      const id = req.params.id;

      const deletedUser = await userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.json({ success: false, message: "No user found to delete" });
      }

      return res.json({ success: true, message: "user deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Error while deleting", error });
    }
  };
}
