"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
userRouter.post('/register', user_controller_1.register);
userRouter.post('/login', user_controller_1.login);
userRouter.get('/me', auth_1.authenticate, user_controller_1.me);
userRouter.post('/refresh', auth_1.authenticate, user_controller_1.refreshToken);
exports.default = userRouter;
