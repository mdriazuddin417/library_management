"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowSchema = void 0;
const zod_1 = require("zod");
exports.borrowSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, 'Book is required'),
    quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
    dueDate: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
        .transform((val) => new Date(val))
        .refine((val) => val > new Date(), 'Due date must be in the future'),
});
