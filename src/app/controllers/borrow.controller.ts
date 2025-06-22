import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { borrowSchema } from "../validators/borrowValidator";


export const borrowRoutes = express.Router()

borrowRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const borrowBody = borrowSchema.parse(req.body);
       await Book.changeBookAvailability(borrowBody.book, borrowBody.quantity);
        const newBorrow = await Borrow.create(borrowBody);
        res.json({
            "success": true,
            message: "Book borrowed successfully",
            data: newBorrow
        });
    } catch (err) {
        next(err);
    }

}
);
borrowRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const borrowSummary = await Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: "$quantity" }
                },

            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: '$book.title',
                        isbn: '$book.isbn',
                    },
                },
            },
        ]);
        res.json({ success: true, message: "Borrows retrieved successfully", data: borrowSummary });
    } catch (err) {
        next(err);
    }
});

