"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchoolValidation = exports.createPaymentValidation = exports.userLoginValidation = exports.userRegisterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userRegisterValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
exports.userLoginValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
exports.createPaymentValidation = joi_1.default.object({
    school_id: joi_1.default.string(),
    trustee_id: joi_1.default.string(),
    student_info: joi_1.default.object({
        name: joi_1.default.string().required(),
        id: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
    }).required(),
    gateway_name: joi_1.default.string().valid("NetBanking").required(),
    custom_order_id: joi_1.default.string().optional(),
    order_amount: joi_1.default.number().min(0).required()
});
exports.createSchoolValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required()
});
