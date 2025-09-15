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
exports.refreshToken = exports.me = exports.login = exports.register = exports.generateJWTToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_model_1 = __importDefault(require("../models/user.model"));
const validation_1 = require("../utils/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateJWTToken({ _id, name, email }) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";
    const token = jsonwebtoken_1.default.sign({ _id, name, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return token;
}
exports.generateJWTToken = generateJWTToken;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { error } = validation_1.userRegisterValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { name, email, password } = data;
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exist"
            });
        }
        yield user_model_1.default.create({
            name, email, password
        });
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not exist"
            });
        }
        const token = generateJWTToken({
            _id: user === null || user === void 0 ? void 0 : user._id,
            name: user.name,
            email: user.email
        });
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user,
                token
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration'
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { error } = validation_1.userLoginValidation.validate(data);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { email, password } = data;
        const existingUser = yield user_model_1.default.findOne({ email }).select('+password');
        //console.log(existingUser)
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Not exist"
            });
        }
        //check password
        const isPasswordValid = yield existingUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        // console.log("isPasswordValid" , isPasswordValid)
        const token = generateJWTToken({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email
        });
        //console.log("Token" , token)
        res.json({
            status: 'success',
            message: 'Login successful',
            existingUser,
            token
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error during Login',
        });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error during getting user',
        });
    }
});
exports.me = me;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error while refreshing token'
        });
    }
});
exports.refreshToken = refreshToken;
