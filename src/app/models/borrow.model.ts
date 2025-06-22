import mongoose from 'mongoose';
import { IBorrow } from '../interfaces/borrow.interface';
import { Book } from './book.model';

const borrowSchema = new mongoose.Schema<IBorrow>({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be a positive number'],
  },
  dueDate: { type: Date,  required: [true, 'dueDate is required'], },
},{
  versionKey:false,
  timestamps:true
});

borrowSchema.pre('save', async function (next) {
  const borrow = this as IBorrow;

  const bookResult = await Book.findById(borrow.book);
  if (!bookResult) return next(new Error('Book not found'));

  next();
});

borrowSchema.post('save', async function () {
  const borrow = this as IBorrow;

  const bookResult = await Book.findById(borrow.book);
  if (!bookResult) return;

  if (bookResult.copies <= 0) {
    bookResult.available = false;
    bookResult.copies = 0;
  }

  await bookResult.save();
});


export const Borrow = mongoose.model<IBorrow>('Borrow', borrowSchema);
