import express from 'express';
import { errorHandler, RequestMiddleware } from './middleware/requestMiddleware';

// Import route files
import studentRoutes from './routes/studentRoutes';
import instructorRoutes from './routes/instructorRoutes';
import courseRoutes from './routes/courseRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(RequestMiddleware);

// Use route files
app.use('/', studentRoutes);
app.use('/', instructorRoutes);
app.use('/', courseRoutes);


// general error handler for all errors
// app.use(errorHandler);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 