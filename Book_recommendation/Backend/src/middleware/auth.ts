

import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

const secretKey = 'shubham'; 

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
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware to authorize based on user roles
const authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        const userRole = req.user.role;
  
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        next();
    };
};

export { verifyToken, authorize };