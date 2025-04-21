import express, { Request, Response, RequestHandler } from 'express';
import { db } from './datastore'; // Assuming this is your custom DB layer
import path from 'path';
// import studentRoutes from './routes/student';

const app = express();
app.use(express.json()); // Enable JSON parsing

// Middleware for logging requests
const RequestMiddleware: RequestHandler = (req, res, next) => {
  console.log('New request:', req.method, req.path, '- body:', req.body);
  next();
};

app.use(RequestMiddleware);


// app.use('/student', studentRoutes); // where studentRoutes is an `express.Router()`



// GET student by ID
app.get('/student/:id', (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const student = db.getStudentById(id);

  if (student) {
    res.status(200).json(student);
  } else {
    res.status(404).send('Student not found');
  }
});

// create a student: id, name , email, password
app.post('/student', (req: Request, res: Response) : any=> {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return res.status(400).send('Missing required fields: id, name, email, password');
  }

  // You can pass hardcoded values for createdBy and secretaryId for now
  const secretaryId = "sec-001"; // example
  db.createStudent(id, secretaryId, name, email, password);

  res.status(201).send('Student created');
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
