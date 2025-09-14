"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolRouter = express_1.default.Router();
const school_controller_1 = require("../controllers/school.controller");
const auth_1 = require("../middleware/auth");
schoolRouter.post('/', auth_1.authenticate, school_controller_1.createSchool);
schoolRouter.get('/', auth_1.authenticate, school_controller_1.getAllSchool);
exports.default = schoolRouter;
