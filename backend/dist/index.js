"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./middleware/errorHandler");
const db_1 = __importDefault(require("./config/db"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const school_route_1 = __importDefault(require("./routes/school.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
//Route
app.use('/api/auth', user_route_1.default);
app.use('/api/school', school_route_1.default);
app.use('/api/order', order_route_1.default);
app.use('/api/transaction', transaction_route_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'School Payment Dashboard API is running',
        timeStamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
