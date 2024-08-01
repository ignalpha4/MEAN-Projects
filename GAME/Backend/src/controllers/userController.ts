import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPatch, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../types/types";
import { userService } from "../services/user.services";
import { verifyToken } from "../middleware/authentication";
import upload from "../middleware/profileUpload";

@controller('/user')
export class userController {

  constructor(@inject<userService>(TYPES.userService) private userService: userService) {}

  @httpPost('/signup', upload)
  async signup(req: Request, res: Response) {
      try {
        const { name, email, password, role } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

        const userInfo = {
          name,
          email,
          password,
          role,
          profileImage,
        };

        const createdUser = await this.userService.signup(userInfo);

        return res.json({ success: true, message: "User Signup successful!" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
  }

  @httpPost('/login')
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const { token, role } = await this.userService.login(email, password);

      return res.json({
        success: true,
        message: "User logged in successfully",
        token,
        role,
      });
    } catch (error:any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  @httpGet('/currentuser', verifyToken)
  async getCurrentUser(req: any, res: Response) {
    try {
      const user = await this.userService.getCurrentUser(req.user.id);
      return res.json({ success: true, message: "Current user found", user });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  @httpPut('/updateProfileImage', verifyToken, upload)
  async updateProfileImage(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

      const updatedUser = await this.userService.updateProfileImage(userId, profileImage);

      return res.json({ success: true, message: "Profile image updated successfully!", updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  @httpGet('/listusers', verifyToken)
  async listUsers(req: any, res: Response) {
    try {
      const users = await this.userService.listUsers();

      return res.json({ success: true, message: "Users found", users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  @httpPatch('/updateUser/:id', upload)
  async updateUser(req: any, res: Response) {
    try {
      const id = req.params.id;
      const userInfo = req.body;

      if (req.file) {
        userInfo.profileImage = `/uploads/${req.file.filename}`;
      }

      const updatedUserDetails = await this.userService.updateUser(id, userInfo);

      return res.json({ success: true, message: "User updated", user: updatedUserDetails });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  @httpDelete('/deleteUser/:id', verifyToken)
  async deleteUser(req: any, res: Response) {
    try {
      const id = req.params.id;

      await this.userService.deleteUser(id);

      return res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}
