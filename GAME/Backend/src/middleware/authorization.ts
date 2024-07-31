import { Response, NextFunction } from 'express';



export class authorizationMiddleware {

    // Middleware to authorize based on user roles
    authorize = (roles: string[]) => {
        return (req: any, res: Response, next: NextFunction) => {
            const userRole = req.user.role;
    
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: 'Access denied.' });
            }
            next();
        };
    };

}
