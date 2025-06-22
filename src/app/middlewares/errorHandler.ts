import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return void res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: err.errors,
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return void res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        name: err.name,
        errors: err.errors,
      },
    });
  }

  if (err.status === 404) {
    return void res.status(404).json({
      success: false,
      message: err.message || 'Not found',
    });
  }

  return void res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: {
      name: err.name || 'Error',
      message: err.message || 'Something went wrong',
    },
  });
};

