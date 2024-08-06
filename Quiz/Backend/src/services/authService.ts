import { injectable } from "inversify";
import bcrypt from "bcrypt";
import user from "../models/usersModel";
import { generateUserToken } from "../utils/jwt";

@injectable()
export class authService {
    async signup(userObj: { name: string, email: string, password: string, role: string, profileImage: string }) {
        try {
          const { name, email, password, role, profileImage } = userObj;
    
          const foundUser = await user.findOne({ email });
          if (foundUser) {
            throw new Error("Email already exists");
          }
    
          const newUser = await user.create({ name, email, password, role, profileImage });
    
          return newUser;
        } catch (error: any) {
          throw new Error(error.message);
        }
    }

  async login(email: string, password: string) {
    try {
      const foundUser = await user.findOne({ email });
      if (!foundUser) {
        throw new Error("User not found with this email");
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

      return { token, user: foundUser };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(id: string) {
    try {
      const foundUser = await user.findById(id);
      if (!foundUser) {
        throw new Error("User not found with this ID");
      }

      return foundUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllUsers() {
    try {
      const users = await user.find();
      if (!users) {
        throw new Error("No users found");
      }

      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
