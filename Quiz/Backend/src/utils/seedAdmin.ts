
import {config} from "dotenv";
import user from "../models/usersModel";

config();

const ADMIN_EMAIL: string =  process.env.adminEmail as string;
const ADMIN_PASSWORD: string =  process.env.adminPassword as string;
// const secretKey:string = process.env.SecretKey as string;

export const seedAdminUser = async () => {
  try {

    const existingAdmin = await user.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      return;
    }

    const adminUser = new user({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "Alpha",
      role:"admin",
    });


    await adminUser.save();

    // const token = jwt.sign(
    //   {
    //     _id: adminUser._id,
    //     role: "admin",
    //     roleName: "admin",
    //   },
    //   secretKey
    // );

    // await adminUser.save();

    console.log("Admin user created successfully.");
  } catch (error: any) {
    console.log("Error seeding admin user:", error);
  } finally {
    // await mongoose.disconnect();
  }
};
