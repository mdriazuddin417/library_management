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
exports.Borrow = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = require("./book.model");
const borrowSchema = new mongoose_1.default.Schema({
    book: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be a positive number'],
    },
    dueDate: { type: Date, required: [true, 'dueDate is required'], },
}, {
    versionKey: false,
    timestamps: true
});
borrowSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const borrow = this;
        const bookResult = yield book_model_1.Book.findById(borrow.book);
        if (!bookResult)
            return next(new Error('Book not found'));
        next();
    });
});
borrowSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const borrow = this;
        const bookResult = yield book_model_1.Book.findById(borrow.book);
        if (!bookResult)
            return;
        bookResult.copies = bookResult.copies - borrow.quantity;
        if (bookResult.copies <= 0) {
            bookResult.available = false;
            bookResult.copies = 0;
        }
        yield bookResult.save();
    });
});
exports.Borrow = mongoose_1.default.model('Borrow', borrowSchema);
