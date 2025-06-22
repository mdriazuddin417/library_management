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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const bookValidator_1 = require("../validators/bookValidator");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = bookValidator_1.bookSchema.parse(req.body);
        const newBook = yield book_model_1.Book.create(book);
        // await Book.changeBookAvailability(newBook._id.toString());
        res.json({ success: true, message: "Book created successfully", data: newBook });
    }
    catch (err) {
        next(err);
    }
}));
exports.booksRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const sortOption = {
            [sortBy]: sort === 'asc' ? 1 : -1,
        };
        const books = yield book_model_1.Book.find(query)
            .sort(sortOption)
            .limit(parseInt(limit, 10));
        if (!books || books.length === 0) {
            const err = new Error('No books found');
            err.status = 404;
            return next(err);
        }
        res.json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.booksRoutes.get('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findById(req.params.bookId);
        if (!book) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.json({ success: true, message: "Book retrieved successfully", data: book });
    }
    catch (err) {
        next(err);
    }
}));
exports.booksRoutes.put('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.copies > 0) {
            req.body.available = true;
        }
        else {
            req.body.available = false;
        }
        const book = yield book_model_1.Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true, runValidators: true });
        if (!book) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        yield book.save();
        res.json({ success: true, message: "Book updated  successfully", data: book });
    }
    catch (err) {
        next(err);
    }
}));
exports.booksRoutes.delete('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndDelete(req.params.bookId);
        if (!book) {
            const err = new Error('Book deleted  found');
            err.status = 404;
            return next(err);
        }
        res.json({
            "success": true,
            "message": "Book deleted successfully",
            "data": null
        });
    }
    catch (err) {
        next(err);
    }
}));
