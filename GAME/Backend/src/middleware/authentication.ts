

import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

const secretKey = 'shubham_bankar'; 

//authenticate the user

const verifyToken = (req: any, res: Response, next: NextFunction) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id: string, email: string, role: string };
        req.user = decoded; 
        next();
    } catch (ex) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

export { verifyToken };