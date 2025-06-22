import { Model, model, Schema } from 'mongoose';
import { IBook } from '../interfaces/book.interface';

interface BookModelType extends Model<IBook> {
  changeBookAvailability(bookId: string, quantity: number): Promise<void>;
}

const bookSchema = new Schema<IBook,BookModelType>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: {
    type: String,
    required: true,
    enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
  },
  isbn: { type: String, required: true, unique: true },
  description: { type: String },
  copies: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
}, {
  versionKey: false,
  timestamps: true,
});

bookSchema.static('changeBookAvailability', async function (bookId: string, quantity: number) {
  console.log('changeBookAvailability called with bookId:', bookId, 'and quantity:', quantity);
  const book = await this.findById(bookId);
  if (!book) throw new Error('Book not found');
  if (book.copies < quantity) {
    throw new Error('Not enough copies available');
  }

  book.copies -= quantity;

  if (book.copies <= 0) {
    book.available = false;
    book.copies = 0;
  }else{
    book.available = true;
    book.copies = book.copies;
  }

  await book.save();
});
export const Book = model<IBook,BookModelType>('Book', bookSchema);
