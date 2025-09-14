"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderRouter = express_1.default.Router();
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middleware/auth");
orderRouter.post('/create-payment', auth_1.authenticate, order_controller_1.createPayment);
orderRouter.get("/verify-payment", order_controller_1.verifyPayment);
exports.default = orderRouter;
