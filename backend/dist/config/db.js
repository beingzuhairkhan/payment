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
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        yield createIndexes();
    }
    catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
});
const createIndexes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create indexes for better query performance
        const db = mongoose_1.default.connection.db;
        // Order collection indexes
        yield (db === null || db === void 0 ? void 0 : db.collection('orders').createIndex({ school_id: 1 }));
        yield (db === null || db === void 0 ? void 0 : db.collection('orders').createIndex({ trustee_id: 1 }));
        yield (db === null || db === void 0 ? void 0 : db.collection('orders').createIndex({ "student_info.id": 1 }));
        // Order Status collection indexes
        yield (db === null || db === void 0 ? void 0 : db.collection('orderstatuses').createIndex({ collect_id: 1 }));
        yield (db === null || db === void 0 ? void 0 : db.collection('orderstatuses').createIndex({ status: 1 }));
        yield (db === null || db === void 0 ? void 0 : db.collection('orderstatuses').createIndex({ payment_time: -1 }));
        // Users collection indexes
        yield (db === null || db === void 0 ? void 0 : db.collection('users').createIndex({ email: 1 }, { unique: true }));
        console.log('Database indexes created successfully');
    }
    catch (error) {
        console.error('Error creating indexes:', error.message);
    }
});
exports.default = connectDB;
