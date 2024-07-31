import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";

config()

const secretKey = process.env.secretKey as string;

export const generateUserToken= (payload:any)=>{
    const token = jwt.sign(payload,secretKey);
    return token;
}

export const validateUserToken= (token:any)=>{
    const decoded:any= jwt.verify(token,secretKey);
    return decoded;
}

