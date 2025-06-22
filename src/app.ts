import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { booksRoutes } from './app/controllers/book.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';
import { errorHandler } from './app/middlewares/errorHandler';

const app: Application = express();
app.use(express.json())
app.use(cors())



app.use('/api/books', booksRoutes);
app.use('/api/borrow', borrowRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Note App');
});


app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  (error as any).status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
