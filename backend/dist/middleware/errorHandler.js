"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    console.log('Error', err);
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Invalid ID format';
        error = { message, statusCode: 400 };
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }
    // JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }
    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }
    res.status(error.statusCode || 500).json(Object.assign({ status: 'error', message: error.message || 'Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
