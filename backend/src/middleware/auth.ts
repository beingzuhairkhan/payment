import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model';



export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Access token is required'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET );
        //console.log("Decoded ", decoded)
        const user = await User.findById(decoded._id)
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User Not Found'
            });
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token is not valid'
        });
    }
}