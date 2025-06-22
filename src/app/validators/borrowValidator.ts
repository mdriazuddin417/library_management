import { z } from 'zod';

export const borrowSchema = z.object({
  book: z.string().min(1, 'Book is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .transform((val) => new Date(val))
    .refine((val) => val > new Date(), 'Due date must be in the future'),
});
