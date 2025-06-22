import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { bookSchema } from "../validators/bookValidator";


export const booksRoutes = express.Router()

booksRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = bookSchema.parse(req.body);
    const newBook = await Book.create(book);
    // await Book.changeBookAvailability(newBook._id.toString());
    res.json({ success: true, message: "Book created successfully", data: newBook });
  } catch (err) {
    next(err);
  }

}
);
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;

    const query: Record<string, any> = {};

    if (filter) {
      query.genre = filter;
    }

    const sortOption: { [key: string]: 1 | -1 } = {
      [sortBy as string]: sort === 'asc' ? 1 : -1,
    };

    const books = await Book.find(query)
      .sort(sortOption)
      .limit(parseInt(limit as string, 10));

    if (!books || books.length === 0) {
      const err = new Error('No books found');
      (err as any).status = 404;
      return next(err);
    }

    res.json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (err) {
    next(err);
  }
});

booksRoutes.get('/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      const err = new Error('Book not found');
      (err as any).status = 404;
      return next(err);
    }
    res.json({ success: true, message: "Book retrieved successfully", data: book });
  } catch (err) {
    next(err);
  }
});

booksRoutes.put('/:bookId', async (req, res, next) => {
  try {
    if (req.body.copies >0) {
      req.body.available = true;
    }else{
      req.body.available = false;
    }
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true, runValidators: true });
    if (!book) {
      const err = new Error('Book not found');
      (err as any).status = 404;
      return next(err);
    }
    await book.save();

    res.json({ success: true, message: "Book updated  successfully", data: book });
  } catch (err) {
    next(err);
  }
});

booksRoutes.delete('/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      const err = new Error('Book deleted  found');
      (err as any).status = 404;
      return next(err);
    }
    res.json({
      "success": true,
      "message": "Book deleted successfully",
      "data": null
    });
  } catch (err) {
    next(err);
  }
});
