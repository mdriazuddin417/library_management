"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSchema = void 0;
const zod_1 = require("zod");
exports.bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    author: zod_1.z.string().min(1, 'Author is required'),
    genre: zod_1.z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']),
    isbn: zod_1.z.string().min(1, 'ISBN is required'),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(0, 'Copies must be a positive number'),
    available: zod_1.z.boolean().optional(),
});
