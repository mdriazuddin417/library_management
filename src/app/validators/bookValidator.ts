import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']),
  isbn: z.string().min(1, 'ISBN is required'),
  description: z.string().optional(),
  copies: z.number().min(0, 'Copies must be a positive number'),
  available: z.boolean().optional(),
});

