import express from 'express'
const schoolRouter = express.Router()
import {createSchool , getAllSchool} from '../controllers/school.controller'
import {authenticate} from '../middleware/auth'


schoolRouter.post('/' ,authenticate, createSchool)
schoolRouter.get('/' ,authenticate, getAllSchool)

export default schoolRouter