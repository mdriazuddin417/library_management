"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        return void res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: err.errors,
        });
    }
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        return void res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: {
                name: err.name,
                errors: err.errors,
            },
        });
    }
    if (err.status === 404) {
        return void res.status(404).json({
            success: false,
            message: err.message || 'Not found',
        });
    }
    return void res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: {
            name: err.name || 'Error',
            message: err.message || 'Something went wrong',
        },
    });
};
exports.errorHandler = errorHandler;
