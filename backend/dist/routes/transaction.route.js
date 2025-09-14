"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionRouter = express_1.default.Router();
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_1 = require("../middleware/auth");
transactionRouter.get('/', auth_1.authenticate, transaction_controller_1.getAllTransactions);
transactionRouter.get('/status/:order_id', auth_1.authenticate, transaction_controller_1.transactionStatusByOrderId);
transactionRouter.get('/school/:schoolId', auth_1.authenticate, transaction_controller_1.getTransactionBySchoolId);
transactionRouter.get('/overview', auth_1.authenticate, transaction_controller_1.dashboardData);
exports.default = transactionRouter;
