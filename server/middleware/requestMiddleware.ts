import { RequestHandler } from 'express';

// Middleware for logging requests in console
export const RequestMiddleware: RequestHandler = (req, res, next) => {
  console.log('New request:', req.method, req.path, '- body:', req.body);
  next();
}; 



// general error handler for all errors
export const errorHandler = (err: Error, req: any, res: any, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke! pls try again');
};