import bcrypt from "bcrypt";
import user from "../models/usermodel";
import { generateUserToken } from "./utils/jwt";

export const signup = async (req: any, res: any) => {
  try {
    const { name, email, password, role, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await user.create({
      name,
      email,
      password: hashedPassword,
      role,
      gender
    });

    if (!createdUser) {
      console.log("error not created");
      return res.json({ success: false, message: "not created rror" });
    }
    console.log("done");
    res.json({ success: true, message: "signup done" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error});
  }
};

export const login = async (req: any, res: any) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      console.log("email not available");
      return res.json({
        message: "email not available",
        success: false,
      });
    }

    const matchedPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchedPassword) {
      console.log("incorrect Password");
      return res.json({ success: false, message: "incorrect Password" });
    }

    const payload = {
      email: foundUser.email,
      id: foundUser._id,
      role: foundUser.role,
    };

    const token = await generateUserToken(payload);

    return res.json({
      success: true,
      message: "User logged in successfully",
      token,
      role: foundUser.role,
      user:foundUser
    });
  } catch (error) {
       console.log(error);
    res.json({ success: false, message: error});
};

}

export const getCurrentUser = async (req: any, res: any) => {

  try {
    const id = req.user.id;

    const currentUser = await user.findById(id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
  
    return res.json({ success: true, user: currentUser });
  } catch (error) {
     console.log(error);
    return  res.json({ success: false, message: error});
  }

};
