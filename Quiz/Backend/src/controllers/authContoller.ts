import { Response, Request } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../Types/user.types";
import { authService } from "../services/authService";
import upload from "../middlewares/profileUpload";
import { verifyToken } from "../middlewares/authenticate";
import { ErrorHandling } from "../utils/errorHelper";

const errorObj = new ErrorHandling();

@controller('/user')
export class userController {
  constructor(@inject(TYPES.authService) private authService: authService) {}

  @httpPost('/signup', upload)
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

      if (!name || !email || !password || !role) {
        throw new Error("Required fields are not provided!");
      }

      const result = await this.authService.signup({ name, email, password, role, profileImage });

      return res.json({ status: true, message: "User signup successful", user: result });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      console.log(errormsg);
      return res.json({ status: false, message: errormsg });
    }
  }

  @httpPost('/login')
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      return res.status(200).json({
        status: true,
        message: "User logged in successfully",
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      console.log(errormsg);
      return res.json({ status: false, message: errormsg });
    }
  }

  @httpGet('/getCurrentUser', verifyToken)
  async getCurrentUser(req: any, res: Response) {
    try {
      const id = req.user.id;
      if (!id) {
        throw new Error("ID Parameter not provided!");
      }

      const user = await this.authService.getCurrentUser(id);

      return res.status(200).json({ status: true, message: "User details found", user });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.json({ status: false, message: errormsg });
    }
  }

  @httpGet('/getAllUsers', verifyToken)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.authService.getAllUsers();

      return res.status(200).json({ status: true, message: "Users List", users });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.status(500).json({ status: false, message: errormsg });
    }
  }
}
