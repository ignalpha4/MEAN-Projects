
import {config} from "dotenv";
import user from "../models/usersModel";

config();

const ADMIN_EMAIL: string =  process.env.adminEmail as string;
const ADMIN_PASSWORD: string =  process.env.adminPassword as string;

export const seedAdminUser = async () => {
  try {

    const existingAdmin = await user.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      return;
    }

    const adminUser = new user({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "Admin",
      role:"admin",
      profileImage:"/uploads/img.gif"
    });

    await adminUser.save();

    console.log("added admin");
  } catch (error: any) {

    console.log("Error adding admin:", error);

  } 
};
