
import jwt from "jsonwebtoken";

const secretKey = "shubham"

export const generateUserToken= (payload:any)=>{
    const token = jwt.sign(payload,secretKey);
    return token;
}
