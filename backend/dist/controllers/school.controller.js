"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSchool = exports.createSchool = void 0;
const validation_1 = require("../utils/validation");
const school_model_1 = __importDefault(require("../models/school.model"));
const createSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { error } = validation_1.createSchoolValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { name, email } = data;
        const existingSchool = yield school_model_1.default.findOne({ email });
        if (existingSchool) {
            res.status(400).json({
                success: false,
                message: "School already exist"
            });
        }
        const newSchool = yield school_model_1.default.create({
            name, email
        });
        res.status(201).json({
            status: 'success',
            message: 'New School Created successfully',
            newSchool
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create payment request'
        });
    }
});
exports.createSchool = createSchool;
const getAllSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield school_model_1.default.find();
        res.status(201).json({
            status: 'success',
            schools
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to create payment request'
        });
    }
});
exports.getAllSchool = getAllSchool;
