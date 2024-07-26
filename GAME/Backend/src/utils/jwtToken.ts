import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = "shubham_bankar"

export const generateUserToken= (payload:any)=>{
    const token = jwt.sign(payload,secretKey);
    return token;
}

export const validateUserToken= (token:any)=>{
    const decoded:any= jwt.verify(token,secretKey);
    return decoded;
}

