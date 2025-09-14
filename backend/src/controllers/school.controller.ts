import { Request, Response } from "express";
import { createSchoolValidation } from '../utils/validation'
import School from "../models/school.model";

export const createSchool = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const { error } = createSchoolValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const {name , email} = data ;
        const existingSchool = await School.findOne({email})
        if(existingSchool){
             res.status(400).json({
                success: false,
                message: "School already exist"
            })
        }

        const newSchool = await School.create({
            name , email
        })

         res.status(201).json({
            status: 'success',
            message: 'New School Created successfully',
            newSchool
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create payment request'
        });
    }
}


export const getAllSchool = async (req:Request , res:Response) => {
    try {
        const schools = await School.find()
         res.status(201).json({
            status: 'success',
            schools
        });
        
    } catch (error) {
         res.status(500).json({
            status: 'error',
            message: 'Failed to create payment request'
        });
    }
}