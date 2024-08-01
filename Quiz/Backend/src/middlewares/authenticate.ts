import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import {config} from 'dotenv'

config();

const secretKey = process.env.secretKey as string; 

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'no token' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id: string, email: string, role: string };
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(400).json({ message: 'token is not valid.' });
    }
};