import dotenv from 'dotenv'
dotenv.config();
import { Request, Response } from "express";
import User from '../models/user.model'
import { userRegisterValidation, userLoginValidation } from '../utils/validation'
import jwt, { SignOptions } from 'jsonwebtoken'
import { NewUser } from "../utils/types";
import mongoose from 'mongoose';



export function generateJWTToken({ _id, name, email }: NewUser): string {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const JWT_EXPIRY: SignOptions["expiresIn"] =
        (process.env.JWT_EXPIRY as SignOptions["expiresIn"]) || "1h";

    const token = jwt.sign(
        { _id, name, email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );

    return token;
}

export const register = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const { error } = userRegisterValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const { name, email, password } = data;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        await User.create({
            name, email, password
        });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not exist"
            })
        }

        const token = generateJWTToken({
            _id: user?._id as mongoose.Types.ObjectId,
            name: user.name,
            email: user.email
        })
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user,
                token
            }
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration'
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const { error } = userLoginValidation.validate(data)
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const { email, password } = data;
        const existingUser = await User.findOne({ email }).select('+password')
        //console.log(existingUser)
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Not exist"
            })
        }

        //check password
        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
       // console.log("isPasswordValid" , isPasswordValid)
        const token = generateJWTToken({
            _id: existingUser._id as mongoose.Types.ObjectId,
            name: existingUser.name,
            email: existingUser.email
        });
        //console.log("Token" , token)

        res.json({
            status: 'success',
            message: 'Login successful',
            existingUser,
            token
        })


    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error during Login',

        });
    }
}

export const me = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            });
        }

        const { _id, name, email } = req.user;

        return res.json({
            status: "success",
            user: {
                _id,
                name,
                email
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error during getting user',
        });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const { _id, name, email } = req.user;

    const token = generateJWTToken({
      _id: _id,   
      name,
      email
    });

    return res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error while refreshing token'
    });
  }
};
