import userModel from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { injectable } from "inversify";
import bcrypt from "bcrypt";
import { generateUserToken } from "../utils/jwtToken";

@injectable()
export class userService {

    async signup(userInfo: IUser) {
        try {
            const createdUser = await userModel.create(userInfo);
            return createdUser;
        } catch (error: any) {
            throw error;
        }
    }

    async login(email: string, password: string) {
        try {
            const foundUser = await userModel.findOne({ email });

            if (!foundUser) {
                throw new Error("User not found with this email!");
            }

            const matchedPassword = await bcrypt.compare(password, foundUser.password);

            if (!matchedPassword) {
                throw new Error("Incorrect Password");
            }

            const payload = {
                email: foundUser.email,
                id: foundUser._id,
                role: foundUser.role,
            };

            const token = generateUserToken(payload);

            return { token, role: foundUser.role };
        } catch (error:any) {
            throw Error(error);
        }
    }

    async getCurrentUser(id: string) {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw new Error("No current user found");
            }
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateProfileImage(userId: string, profileImage: string) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { profileImage },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error("Error updating the user");
            }

            return updatedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async listUsers() {
        try {
            const users = await userModel.find({ role: "user" });
            if (!users) {
                throw new Error("No users found");
            }
            return users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateUser(id: string, userInfo: Partial<IUser>) {
        try {
            const existingUser = await userModel.findById(id);
            if (!existingUser) {
                throw new Error("No user found to update");
            }

            const updatedUserDetails = await userModel.findByIdAndUpdate(id, userInfo, { new: true });

            return updatedUserDetails;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteUser(id: string) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new Error("No user found to delete");
            }
            return deletedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
